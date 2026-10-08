import "server-only";
import { site } from "@content/site";

/** Live stats for the profile cards. Every fetch is cached for 6 hours and never throws. */
const REVALIDATE = 60 * 60 * 6;

export type GithubStats = {
  name: string;
  avatar: string;
  repos: number;
  followers: number;
  stars: number;
  top: { name: string; description: string; stars: number; language: string | null; url: string }[];
} | null;

export type LeetcodeStats = {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  totals: { easy: number; medium: number; hard: number };
  rating: number | null;
  contests: number | null;
  topPercent: number | null;
  live: boolean;
};

export async function getGithubStats(): Promise<GithubStats> {
  const user = site.profiles.github.username;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const [uRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers, next: { revalidate: REVALIDATE } }),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&type=owner`, {
        headers,
        next: { revalidate: REVALIDATE },
      }),
    ]);
    if (!uRes.ok || !rRes.ok) return null;
    const u = (await uRes.json()) as {
      name: string | null;
      avatar_url: string;
      public_repos: number;
      followers: number;
    };
    const repos = (await rRes.json()) as {
      name: string;
      description: string | null;
      stargazers_count: number;
      language: string | null;
      html_url: string;
      fork: boolean;
    }[];
    const own = repos.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase());
    return {
      name: u.name ?? user,
      avatar: u.avatar_url,
      repos: u.public_repos,
      followers: u.followers,
      stars: own.reduce((n, r) => n + r.stargazers_count, 0),
      top: own
        .filter((r) => r.description)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3)
        .map((r) => ({
          name: r.name.replace(/[-_]/g, " "),
          description: r.description ?? "",
          stars: r.stargazers_count,
          language: r.language,
          url: r.html_url,
        })),
    };
  } catch {
    return null;
  }
}

const LEETCODE_QUERY = `query($u: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $u) { submitStatsGlobal { acSubmissionNum { difficulty count } } }
  userContestRanking(username: $u) { rating attendedContestsCount topPercentage }
}`;

export async function getLeetcodeStats(): Promise<LeetcodeStats> {
  const { username, fallback } = site.profiles.leetcode;
  const offline: LeetcodeStats = {
    solved: fallback.solved,
    easy: 0,
    medium: 0,
    hard: 0,
    totals: { easy: 0, medium: 0, hard: 0 },
    rating: fallback.rating,
    contests: null,
    topPercent: null,
    live: false,
  };
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query: LEETCODE_QUERY, variables: { u: username } }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return offline;
    type Count = { difficulty: string; count: number };
    const { data } = (await res.json()) as {
      data?: {
        allQuestionsCount: Count[];
        matchedUser: { submitStatsGlobal: { acSubmissionNum: Count[] } } | null;
        userContestRanking: {
          rating: number;
          attendedContestsCount: number;
          topPercentage: number;
        } | null;
      };
    };
    const ac = data?.matchedUser?.submitStatsGlobal.acSubmissionNum;
    if (!ac) return offline;
    const get = (list: Count[], d: string) => list.find((c) => c.difficulty === d)?.count ?? 0;
    const all = data?.allQuestionsCount ?? [];
    return {
      solved: get(ac, "All"),
      easy: get(ac, "Easy"),
      medium: get(ac, "Medium"),
      hard: get(ac, "Hard"),
      totals: { easy: get(all, "Easy"), medium: get(all, "Medium"), hard: get(all, "Hard") },
      rating: data?.userContestRanking
        ? Math.round(data.userContestRanking.rating)
        : fallback.rating,
      contests: data?.userContestRanking?.attendedContestsCount ?? null,
      topPercent: data?.userContestRanking?.topPercentage ?? null,
      live: true,
    };
  } catch {
    return offline;
  }
}
