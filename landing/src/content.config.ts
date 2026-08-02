import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The reference documentation, read from the sibling directory it already lives
 * in rather than copied here.
 *
 * `dmtools-ai-docs/` is the Claude Code skill folder for this repository — the
 * same Markdown an agent reads is what these pages render. Publishing it as
 * HTML is the point: the source of truth stays where contributors already edit
 * it, and nothing has to be kept in step by hand.
 *
 * Four files are excluded, and the reason is editorial rather than technical:
 *
 *   IMPORTANT_LESSONS.md   development retro — "mistakes made during agent
 *                          development". Working notes, not documentation.
 *   SKILL.scl.md           a lossy compression of SKILL.md for LLM ingestion.
 *   SKILL.ultra.md         a raw prompt kernel in a fenced block.
 *   CHANGELOG.md           release notes; the repository serves them already.
 *
 * The first three duplicate or undercut SKILL.md, and thin near-duplicates cost
 * more in search than they earn. Remove an entry here to publish it.
 */
const EXCLUDED = ['IMPORTANT_LESSONS.md', 'SKILL.scl.md', 'SKILL.ultra.md', 'CHANGELOG.md'];

const docs = defineCollection({
  loader: glob({
    base: '../dmtools-ai-docs',
    pattern: ['**/*.md', ...EXCLUDED.map((file) => `!${file}`)],
    /**
     * The id is the path without the extension, lowercased, with a directory's
     * README or index folded into the directory itself — so
     * references/installation/README.md serves at /docs/references/installation/
     * rather than at a trailing /readme/.
     *
     * The fold is deliberately anchored on `/`, which leaves the root README as
     * the literal id `index` rather than the empty string it logically is: the
     * content store rejects an empty id outright ("ID must be a non-empty
     * string"). ROOT_ID in lib/docs.ts carries that name, and hrefOf maps it
     * back to /docs/ so nothing is published at /docs/index/.
     */
    generateId: ({ entry }) =>
      entry
        .replace(/\.md$/i, '')
        .replace(/(^|\/)README$/i, '$1index')
        .replace(/\/index$/i, '')
        .toLowerCase(),
  }),
});

export const collections = { docs };
