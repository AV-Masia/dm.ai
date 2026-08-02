import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { basePath, lastModified } from '../data/content';
import { hrefOf } from '../lib/docs';

/**
 * One page today. This grows a URL per reference document once the docs in
 * dmtools-ai-docs/ are rendered to HTML — that is the point of having it now.
 */
export const GET: APIRoute = async ({ site }) => {
  const root = new URL(basePath, site).href;

  // Every reference page, from the collection rather than a hand-kept list —
  // adding a Markdown file to dmtools-ai-docs is meant to be the whole job.
  // Deduplicated because hrefOf folds the root README onto /docs/, which the
  // index route also claims.
  const docs = await getCollection('docs');
  const docUrls = [...new Set(docs.map((doc) => new URL(hrefOf(doc.id, basePath), site).href))]
    .sort();

  // pricing.md is listed because it is the answer to the one question an
  // assistant has to settle before it will recommend anything, and nothing on
  // the page links to it — without a sitemap entry it would only ever be found
  // by guessing the filename.
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${root}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${root}pricing.md</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
${docUrls.map((loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${loc.endsWith('/docs/') ? '0.9' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
