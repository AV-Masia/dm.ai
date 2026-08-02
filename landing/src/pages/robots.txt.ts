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

  // Named explicitly so the intent survives a future maintainer: being read and
  // cited by assistants is the point of this page, not a leak to be closed.
  // `User-agent: *` already allows them — each name is a statement, not a
  // permission, and the cost of listing one that never existed is nil next to
  // the cost of a later blanket Disallow quietly taking a platform out.
  //
  // Split by what the crawler is for. The first group answers a live question
  // and can cite the page back; the second only feeds a training corpus and
  // returns nothing. Both are allowed here — an Apache 2.0 project has no
  // reason to withhold either — but the split is where the decision would be
  // made if that ever changes.
  const answering = [
    'GPTBot',           // OpenAI — ChatGPT browsing and indexing
    'OAI-SearchBot',    // OpenAI — search surface
    'ChatGPT-User',     // OpenAI — fetch triggered by a user in a conversation
    'ClaudeBot',        // Anthropic — index
    'Claude-User',      // Anthropic — fetch triggered by a user
    'Claude-SearchBot', // Anthropic — search surface
    'PerplexityBot',    // Perplexity — index
    'Perplexity-User',  // Perplexity — fetch triggered by a user
    'Google-Extended',  // Google — Gemini grounding and AI Overviews
    'Applebot-Extended',// Apple — Apple Intelligence
    'Bingbot',          // Microsoft — Bing index, which is what Copilot answers from
    'Amazonbot',        // Amazon — Alexa and Rufus
    'MistralAI-User',   // Mistral — Le Chat
  ];

  const training = [
    'anthropic-ai',       // Anthropic — legacy training crawler
    'cohere-ai',
    'Meta-ExternalAgent', // Meta — AI training
    'CCBot',              // Common Crawl, which most corpora are built from
  ];

  const block = (agents: string[]) =>
    agents.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n');

  const body = `# Served at ${root}robots.txt

User-agent: *
Allow: /

# Assistants that answer a question and can cite this page back.
${block(answering)}

# Crawlers that only collect for training.
${block(training)}

Sitemap: ${root}sitemap.xml
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
