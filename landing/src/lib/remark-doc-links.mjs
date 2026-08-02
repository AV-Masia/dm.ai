import { dirname, resolve, relative, sep } from 'node:path';
import { existsSync } from 'node:fs';

/**
 * Rewrites the Markdown links in dmtools-ai-docs so they still resolve once the
 * files are served as HTML.
 *
 * The docs were written to be read in the repository, where every link is a
 * relative path to another file. Rendered as pages, none of those survive: a
 * link to `../configuration/json-config-rules.md` is a 404 on the site, and the
 * ones that climb out of the docs tree — to `dmtools-core/**.java`, to
 * `agents/*.json`, to the root README — have no page to point at all.
 *
 * So each link is resolved against the file it appears in and sorted into one
 * of two cases:
 *
 *   inside dmtools-ai-docs  ->  the page that file became, /docs/<slug>/
 *   anywhere else           ->  the same file on GitHub
 *
 * Fragments are carried through both. Absolute URLs, mailto: and bare anchors
 * are left alone.
 *
 * Doing this here rather than editing the Markdown keeps the source readable in
 * the repository, which is where contributors and the agent skill read it.
 */
export function remarkDocLinks({ docsRoot, repoRoot, repoUrl, base, branch = 'main' }) {
  const toSlug = (absolute) => {
    const rel = relative(docsRoot, absolute).split(sep).join('/');
    return rel
      .replace(/\.md$/i, '')
      .replace(/(^|\/)README$/i, '$1index')
      .replace(/(^|\/)index$/i, '')
      .replace(/\/$/, '')
      .toLowerCase();
  };

  const isInside = (parent, child) => {
    const rel = relative(parent, child);
    return rel !== '' && !rel.startsWith('..') && !rel.startsWith(sep + '..');
  };

  const missing = [];

  return () => (tree, file) => {
    const from = file?.history?.[0] ?? file?.path;
    if (!from) return;
    const here = dirname(from);

    /**
     * A link whose target does not exist on disk is already broken in the
     * repository — eight of them were, to files like
     * references/configuration/integrations/figma.md that were never written.
     * Rewriting one anyway would turn a dead link in a Markdown file into a
     * dead link on a public site, which is the one thing this whole exercise is
     * meant to avoid. The text stays, the href goes, and the build says so.
     */
    // emphasis, not paragraph: a link is inline, and a block node here would
    // be invalid inside the paragraph it sits in. The text keeps its emphasis
    // so a reader can still see it was meant to point somewhere.
    const unlink = (node) => {
      node.type = 'emphasis';
      delete node.url;
      delete node.title;
    };

    const walk = (node) => {
      if (node.type === 'link' && typeof node.url === 'string') {
        const next = rewrite(node.url);
        if (next === null) {
          missing.push(`${relative(docsRoot, from).split(sep).join('/')} → ${node.url}`);
          unlink(node);
        } else {
          node.url = next;
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };

    const rewrite = (url) => {
      // Absolute, protocol-relative, mailto, and in-page anchors stay as they are.
      if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return url;

      const [path, hash = ''] = url.split('#');
      const fragment = hash ? `#${hash}` : '';
      if (!path) return url;

      // Only file references need moving. A link already pointing at a
      // directory is left for the author to fix — guessing at it would hide
      // the mistake rather than surface it.
      if (!/\.md$/i.test(path)) {
        const target = resolve(here, path);
        if (isInside(repoRoot, target)) {
          const rel = relative(repoRoot, target).split(sep).join('/');
          return `${repoUrl}/blob/${branch}/${rel}${fragment}`;
        }
        return url;
      }

      const target = resolve(here, path);

      if (isInside(docsRoot, target) || target === docsRoot) {
        // null means "there is no such file" — the caller unlinks and reports.
        if (!existsSync(target)) return null;
        const slug = toSlug(target);
        return `${base}docs/${slug ? `${slug}/` : ''}${fragment}`;
      }

      if (isInside(repoRoot, target)) {
        const rel = relative(repoRoot, target).split(sep).join('/');
        return `${repoUrl}/blob/${branch}/${rel}${fragment}`;
      }

      return url;
    };

    walk(tree);

    // Best-effort report. Astro runs the content loader inside a module runner
    // that swallows both console and stderr, so this is reliably visible when
    // the plugin is exercised directly and often invisible during `astro
    // build`. The check that actually holds is auditing the built HTML for
    // internal links with no matching page — the unlink above is what keeps
    // that audit at zero regardless of whether anyone reads this line.
    if (missing.length) {
      process.stderr.write(
        `\n[docs] ${missing.length} link(s) point at Markdown that does not exist. `
        + 'Rendered as plain text so the site ships none broken — fix them in the repo:\n'
        + missing.map((m) => `  ${m}\n`).join('')
        + '\n',
      );
      missing.length = 0;
    }
  };
}
