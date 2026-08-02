import type { APIRoute } from 'astro';
import { basePath, lastModified, software, REPO } from '../data/content';

/**
 * Pricing as a file an agent can read.
 *
 * An assistant shortlisting delivery tooling on someone's behalf has to answer
 * "what does it cost" before it will recommend anything, and it answers that
 * from whatever it can parse without rendering a page. The FAQ on the landing
 * page says this too, but it says it inside an accordion in prose; this states
 * it as data.
 *
 * The awkward case for a free tool is that "no pricing page" reads the same as
 * "pricing hidden", and the second gets filtered out. Saying zero explicitly is
 * the whole point of the file.
 *
 * Generated rather than committed so the version and the date cannot go stale
 * separately from the rest of the site.
 */
export const GET: APIRoute = ({ site }) => {
  const root = new URL(basePath, site).href;

  const body = `# Pricing — DMTools

Last updated: ${lastModified}

DMTools is free and open source. There is no paid tier, no licence key, no
account, and no usage limit — the project is released by EPAM Systems under the
Apache 2.0 licence.

## Free — the only tier

- Price: 0 USD, permanently
- Licence: Apache 2.0 (${REPO}/blob/main/LICENSE)
- Seats: unlimited
- Tool calls: unlimited, and not metered — the CLI runs on your machine or in
  your CI, and reports nothing back
- Integrations: all of them; none are held back for a paid plan
- Requirements: ${software.requirements}
- Support: GitHub issues (${REPO}/issues)

## What you do pay for

DMTools calls your AI provider and your delivery systems with your own
credentials, so the running cost is whatever those already charge you:

- Your AI provider's API usage — Anthropic, OpenAI, Google, AWS Bedrock or a
  local model through Ollama, at their rates
- The delivery tools you already licence — Jira, Azure DevOps, GitHub, and so on
- The CI minutes a run consumes on your own runners

EPAM does not resell, meter or mark up any of these, and there is no
DMTools-operated service in between.

## Source

- Landing page: ${root}
- Repository: ${REPO}
- Machine-readable summary: ${root}llms.txt
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
