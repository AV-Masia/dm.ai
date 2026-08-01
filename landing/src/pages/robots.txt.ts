import type { APIRoute } from 'astro';
import { basePath } from '../data/content';

/**
 * Crawlers read robots.txt from the ORIGIN root only, so on a github.io project
 * path this file documents intent rather than enforcing it — GitHub's own file
 * governs *.github.io. It goes live with a custom domain; until then the
 * sitemap must be submitted through Search Console to be found.
 */
export const GET: APIRoute = ({ site }) => {
  const root = new URL(basePath, site).href;

  const body = `# Served at ${root}robots.txt

User-agent: *
Allow: /

# Named explicitly so the intent survives a future maintainer: being read and
# cited by assistants is the point of this page, not a leak to be closed.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${root}sitemap.xml
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
