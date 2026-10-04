/** Normalises untrusted text before it reaches a model or an email. */
export function sanitizeText(input: string, maxLength: number) {
  return (
    input
      .normalize("NFKC")
      // zero-width and bidi control characters
      .replace(/[​-‏‪-‮⁠-⁤﻿]/g, "")
      // ASCII control chars except tab and newline
      .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, maxLength)
  );
}

/** Stops visitor text from closing the XML-style tags used in prompts. */
export function neutralizeTags(input: string) {
  return input.replace(
    /<\/?\s*(portfolio_context|visitor_question|job_description|source)[^>]*>/gi,
    "",
  );
}
