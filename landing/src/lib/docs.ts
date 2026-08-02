import { getCollection, type CollectionEntry } from 'astro:content';

export type Doc = CollectionEntry<'docs'>;

/**
 * The title, taken from the document's own first heading.
 *
 * None of these files carry front matter — they are repository documentation,
 * not CMS entries — so the H1 is the only title that exists. Falling back to the
 * filename keeps a document that opens with a table or a code fence from
 * appearing in the navigation as a blank row.
 */
export function titleOf(doc: Doc): string {
  const heading = doc.body?.match(/^#\s+(.+?)\s*$/m);
  if (heading) return heading[1].replace(/[*_`]/g, '').trim();

  const last = doc.id.split('/').pop() ?? doc.id;
  return last.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** The first paragraph, for the index cards and the meta description. */
export function summaryOf(doc: Doc): string {
  const body = (doc.body ?? '')
    .replace(/^---[\s\S]*?---/, '')       // skill front matter, where present
    .replace(/^#\s+.+$/m, '')             // the title we already took
    .replace(/```[\s\S]*?```/g, '')       // fenced blocks are never a summary
    .replace(/^\s*[|>#-].*$/gm, '');      // tables, quotes, headings, bullets

  const paragraph = body.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p.length > 40);
  if (!paragraph) return '';

  const flat = paragraph
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // link text only
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return flat.length > 200 ? `${flat.slice(0, 197).trimEnd()}…` : flat;
}

/**
 * The sections, in the order a reader needs them rather than alphabetically:
 * install it, configure it, then the tool and job references, then the deeper
 * material. Anything not listed falls to the end under its own name.
 */
const ORDER: { prefix: string; label: string }[] = [
  { prefix: 'references/installation', label: 'Installation' },
  { prefix: 'references/configuration', label: 'Configuration' },
  { prefix: 'references/mcp-tools', label: 'MCP tools' },
  { prefix: 'references/jobs', label: 'Jobs' },
  { prefix: 'references/agents', label: 'Agents' },
  { prefix: 'references/workflows', label: 'Workflows' },
  { prefix: 'references/test-generation', label: 'Test generation' },
  { prefix: 'references/reporting', label: 'Reporting' },
  { prefix: 'per-skill-packages', label: 'Skill packages' },
];

export interface NavSection {
  label: string;
  items: { id: string; title: string; href: string }[];
}

/**
 * The root README's id. It is the docs index and belongs at /docs/, but the
 * content store will not accept the empty string that would say so — see the
 * note in content.config.ts. Everything that turns an id into a URL routes
 * through hrefOf so the name never leaks into a path.
 */
export const ROOT_ID = 'index';

export const hrefOf = (id: string, base: string): string =>
  id === ROOT_ID || !id ? `${base}docs/` : `${base}docs/${id}/`;

export async function buildNav(base: string): Promise<NavSection[]> {
  const docs = await getCollection('docs');

  const entries = docs
    .map((doc) => ({
      id: doc.id,
      title: doc.id === ROOT_ID ? 'Overview' : titleOf(doc),
      href: hrefOf(doc.id, base),
      file: (doc.filePath ?? '').split('/').pop()?.replace(/\.md$/i, '') ?? '',
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  /**
   * Two files carry the same H1 — references/mcp-tools/README.md and
   * TOOLS-REFERENCE.md are both "DMtools MCP Tools Reference" — which put the
   * same row in the sidebar twice with no way to tell which was which. The
   * headings belong to the repository and are not ours to rewrite, so the
   * navigation disambiguates instead, using the filename that already
   * distinguishes them.
   */
  const counts = new Map<string, number>();
  entries.forEach((e) => counts.set(e.title, (counts.get(e.title) ?? 0) + 1));

  entries.forEach((e) => {
    if ((counts.get(e.title) ?? 0) < 2) return;
    const label = /^(README|index)$/i.test(e.file)
      ? 'Overview'
      : e.file.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    e.title = `${e.title} — ${label}`;
  });

  entries.sort((a, b) => a.title.localeCompare(b.title));

  const used = new Set<string>();
  const sections: NavSection[] = [];

  // "Overview" first: the root README and SKILL.md, which are the two entry
  // points and belong to no reference section.
  const overview = entries.filter((e) => !e.id.includes('/'));
  overview.forEach((e) => used.add(e.id));
  if (overview.length) sections.push({ label: 'Overview', items: overview });

  for (const { prefix, label } of ORDER) {
    const items = entries.filter((e) => e.id === prefix || e.id.startsWith(`${prefix}/`));
    if (!items.length) continue;
    items.forEach((e) => used.add(e.id));
    sections.push({ label, items });
  }

  const rest = entries.filter((e) => !used.has(e.id));
  if (rest.length) sections.push({ label: 'Reference', items: rest });

  return sections;
}
