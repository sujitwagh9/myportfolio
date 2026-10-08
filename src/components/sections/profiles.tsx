import { site } from "@content/site";
import { getGithubStats, getLeetcodeStats } from "@/lib/profiles";
import { ProfileCards } from "./profile-cards";
import { Section, SectionHeading } from "./section-heading";

export async function Profiles() {
  const [github, leetcode] = await Promise.all([getGithubStats(), getLeetcodeStats()]);
  const p = site.profiles;
  return (
    <Section id="profiles" watermark="Profiles">
      <SectionHeading index="05" eyebrow="Profiles" title="Where I code." />
      <ProfileCards
        github={github}
        githubUser={p.github.username}
        leetcode={leetcode}
        leetcodeUser={p.leetcode.username}
        gfg={p.gfg}
        codechef={p.codechef}
      />
    </Section>
  );
}
