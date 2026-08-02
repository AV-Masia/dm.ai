/**
 * Everything the page states, stated once.
 *
 * Anything appearing twice on the page belongs here rather than in a section —
 * the FAQ renders both as the visible accordion and as the FAQPage structured
 * data, and the bridge diagram's pills are also its text fallback. Typed out
 * separately they drift, and nothing catches it.
 */

const rawBase = import.meta.env.BASE_URL;

/** The site's own root, base path included. Absolute URLs are built from it. */
export const basePath = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/** Prefix a file in public/ with the base path this repository publishes under. */
export const asset = (path: string): string => basePath + path.replace(/^\//, '');

export const REPO = 'https://github.com/epam/dm.ai';
export const DOCS = `${REPO}/tree/main/dmtools-ai-docs`;
const RELEASE = `${REPO}/releases/latest/download`;

/**
 * Feeds sitemap.xml, `dateModified` in the structured data, and the footer line.
 * Bump it when the page's content changes.
 */
export const lastModified = '2026-08-02';

/**
 * The publisher as an entity: `sameAs` ties the page to the company an assistant
 * already knows rather than to the string "EPAM".
 *
 * EPAM Systems has no English Wikipedia article — `/wiki/EPAM` is a
 * psychological learning model, a different subject — so Wikidata carries the
 * identity. Do not add a Wikipedia link without checking which EPAM it means.
 */
export const organization = {
  name: 'EPAM Systems',
  url: 'https://www.epam.com',
  wikidata: 'https://www.wikidata.org/wiki/Q1275613',
  sameAs: [
    'https://www.wikidata.org/wiki/Q1275613',
    'https://www.linkedin.com/company/epam-systems',
    'https://github.com/epam',
    'https://solutionshub.epam.com',
  ],
} as const;

// ---------------------------------------------------------------- head ----

export const meta = {
  lang: 'en',
  title: 'DMTools — Enterprise AI-Factory Orchestrator | EPAM Open Source',
  description:
    "DMTools is EPAM's open-source AI-factory orchestrator. 320+ CLI tools across 20+ integrations — Jira, Azure DevOps, GitHub, Figma, Teams and every major AI provider — behind one CLI. Apache 2.0.",
  keywords:
    'DMTools, EPAM, AI orchestrator, AI factory, CLI tools, MCP, Jira, GitHub, Azure DevOps, Figma, Confluence, delivery automation, open source',
  siteName: 'DMTools by EPAM',
  socialTitle: 'DMTools — Enterprise AI-Factory Orchestrator',
  ogDescription:
    '320+ CLI tools. 20+ integrations. One orchestration layer for your AI factory. Open source from EPAM.',
  twitterDescription:
    '320+ CLI tools. 20+ integrations. One orchestration layer for your AI factory.',
  // Night in both cases: the browser chrome should match the canvas the page
  // actually opens on, not the OS preference.
  themeColor: '#060606',
  ogImage: 'assets/og-cover.png',
  favicon: 'assets/favicon.svg',
} as const;

/** softwareVersion tracks gradle.properties — the one field that goes stale silently. */
export const software = {
  version: '1.7.238',
  description:
    'Enterprise AI-factory orchestrator for automating delivery workflows across trackers, source control, documentation, design systems, AI providers, and CI/CD.',
  requirements: 'Java 17 or newer',
  operatingSystem: 'Linux, macOS, Windows',
  features: [
    '320+ CLI tools across 20+ enterprise integrations',
    'Model Context Protocol server for Claude, Cursor and Copilot',
    'JavaScript agents with direct access to every tool',
    'Runs in GitHub Actions, GitLab CI, Jenkins and Bitrise',
    'Runtime AI provider selection across Claude, OpenAI, Gemini, Vertex AI, Bedrock, DIAL and Ollama',
  ],
} as const;

// ---------------------------------------------------------------- film ----

/** One YouTube id: it feeds the section, the embed and the VideoObject block. */
export const film = {
  youtubeId: 'EQp_leZgVtk',
  name: 'DMTools - Introduction',
  uploadDate: '2026-07-31',
  description:
    "A nine-scene introduction to DMTools, EPAM's open-source AI-factory orchestrator, in the EPAM 2023 brand system.",
  poster: 'assets/film-poster.jpg',
  posterAlt:
    'Still from the DMTools film: a ticket state change in Azure DevOps or Jira passes through a bridge that fires workflow_dispatch into a CI/CD container runner.',
  publisher: { name: 'AI Native', url: 'https://www.youtube.com/@AI-Native-Pro' },
  sourceUrl: 'https://github.com/IstiN/yoclip-examples/tree/main/branded/epam/dmtools',
} as const;

export const filmEmbedUrl = `https://www.youtube-nocookie.com/embed/${film.youtubeId}`;
export const filmWatchUrl = `https://www.youtube.com/watch?v=${film.youtubeId}`;

// ------------------------------------------------------------ navigation ----

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

/** In-page entries drive the scroll spy: it pairs each `#`-link with that section. */
export const navLinks: NavLink[] = [
  { label: 'Why', href: '#problem' },
  { label: 'Platform', href: '#layer' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Adoption', href: '#paths' },
  { label: 'FAQ', href: '#faq' },
  // The rendered docs, not the folder listing on GitHub.
  { label: 'Docs', href: `${basePath}docs/` },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Docs',
    links: [
      { label: 'Installation', href: `${DOCS}/references/installation` },
      { label: 'Configuration', href: `${DOCS}/references/configuration` },
      { label: 'MCP tools', href: `${DOCS}/references/mcp-tools` },
      { label: 'Jobs and agents', href: `${DOCS}/references/jobs` },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: REPO },
      { label: 'Releases', href: `${REPO}/releases` },
      { label: 'Contributing', href: `${REPO}/blob/main/CONTRIBUTING.md` },
      { label: 'Issues', href: `${REPO}/issues` },
    ],
  },
  {
    title: 'EPAM',
    links: [
      { label: 'epam.com', href: 'https://www.epam.com' },
      { label: 'SolutionsHub', href: 'https://solutionshub.epam.com' },
      { label: 'Licence', href: `${REPO}/blob/main/LICENSE` },
      { label: 'Security', href: `${REPO}/blob/main/SECURITY.md` },
    ],
  },
];

// ---------------------------------------------------------- integrations ----

export interface Column {
  label: string;
  /** Drawn as pills in the SVG — the diagram has room for these and no more. */
  shown: string[];
  /** The rest: text fallback and the line under the diagram, which is what makes "20+" checkable. */
  also: string[];
}

export const aiProviders: Column = {
  label: 'AI providers',
  shown: ['Anthropic Claude', 'OpenAI', 'Google Gemini', 'AWS Bedrock', 'GitHub Copilot', 'Ollama'],
  also: ['Vertex AI', 'DIAL'],
};

export const deliverySystems: Column = {
  label: 'Delivery & collaboration',
  shown: ['Jira', 'Azure DevOps', 'GitHub', 'GitLab', 'Confluence', 'Figma', 'Microsoft Teams', 'TestRail'],
  also: ['Bitrise', 'Jenkins', 'SharePoint', 'Bitbucket'],
};

export interface Bar {
  name: string;
  tools: number;
}

/**
 * Widest first. Bar lengths are derived from `tools` against the axis in
 * Numbers.astro — a hand-kept width fraction beside the number would let the
 * two disagree, and the chart would keep drawing the old figure.
 */
export const bars: Bar[] = [
  { name: 'Jira', tools: 69 },
  { name: 'Azure DevOps', tools: 38 },
  { name: 'GitHub', tools: 35 },
  { name: 'Teams', tools: 31 },
  { name: 'GitLab', tools: 30 },
  { name: 'Bitrise', tools: 23 },
  { name: 'Figma', tools: 22 },
  { name: 'Confluence', tools: 19 },
  { name: 'TestRail', tools: 17 },
  { name: 'Jenkins', tools: 5 },
];

// ------------------------------------------------------------ page copy ----

export interface FlowStep {
  title: string;
  desc: string;
  /** Renders as <code> inside the description, with descAfter following it. */
  code?: string;
  descAfter?: string;
}

/**
 * The run, top to bottom. A stage with a `label` draws as a container around
 * its steps — that is the CI/CD runner, and the grouping is the point: those
 * four happen inside one throwaway container, the ones on either side do not.
 *
 * Steps are numbered by position across the whole flow, so reordering a stage
 * renumbers the diagram rather than leaving a hand-typed label behind.
 */
export interface FlowStage {
  label?: string;
  steps: FlowStep[];
}

export const flow: FlowStage[] = [
  {
    steps: [{ title: 'Ticket', desc: 'Jira or Azure DevOps fires a service hook on update.' }],
  },
  {
    steps: [
      { title: 'Bridge', desc: 'A small function triggers ', code: 'workflow_dispatch', descAfter: '.' },
    ],
  },
  {
    label: 'CI/CD container runner',
    steps: [
      { title: 'DMTools CLI', desc: 'Installed fresh for this run — nothing to deploy.' },
      { title: 'Context', desc: 'A pre-action pulls the ticket, wiki, repository and knowledge base.' },
      { title: 'Reasoning', desc: 'Your chosen provider works with the full picture, not a snippet.' },
      { title: 'Publish', desc: 'A post-action opens a branch and a pull request.' },
    ],
  },
  {
    steps: [{ title: 'Pull Request', desc: 'Code and documentation, waiting for review.' }],
  },
];

/**
 * Outside the numbered run on purpose: it gates the run rather than being a
 * step in it. Kept short because it is set along the diagram — a longer line
 * runs past the last step instead of spanning it.
 */
export const humanInTheLoop = {
  title: 'Human in the loop',
  desc: 'reviews the story, approves the pull request.',
};

export interface AdoptionPath {
  title: string;
  desc: string;
  link: { label: string; href: string };
}

export const paths: AdoptionPath[] = [
  {
    title: 'CLI and MCP tools',
    desc: 'Run direct tool calls against every connected system from your terminal. 320+ tools, available the moment you install.',
    link: { label: 'MCP tools reference →', href: `${DOCS}/references/mcp-tools` },
  },
  {
    title: 'Jobs and agents',
    desc: 'Orchestrate real workflows — AI teammate, reporting, test generation, story development — in plain JavaScript.',
    link: { label: 'Jobs reference →', href: `${DOCS}/references/jobs` },
  },
  {
    title: 'CI/CD pipelines',
    desc: 'Run DMTools in GitHub Actions, GitLab CI, Jenkins or Bitrise for ticket processing and teammate flows at scale.',
    // A file, so /blob/ — DOCS points at /tree/, which is for directories.
    link: {
      label: 'GitHub Actions guide →',
      href: `${REPO}/blob/main/dmtools-ai-docs/references/workflows/github-actions-teammate.md`,
    },
  },
  {
    title: 'Agent skills',
    desc: 'Install project-level DMTools skills for Cursor, Claude, Codex and Copilot. The agents your teams already use gain full delivery reach.',
    link: { label: 'Skill guide →', href: `${REPO}/blob/main/dmtools-ai-docs/SKILL.md` },
  },
];

export interface InstallTab {
  /** Suffix behind every paired id: tab-<id>, panel-<id>, cmd-<id>. */
  id: string;
  label: string;
  command: string;
  hint: string;
}

export const installTabs: InstallTab[] = [
  {
    id: 'unix',
    label: 'Linux / macOS',
    command: `curl -fsSL ${RELEASE}/install.sh | bash`,
    hint: 'Installs the CLI to <code>~/.dmtools</code>. Requires Java 17 or newer.',
  },
  {
    id: 'win',
    label: 'Windows PowerShell',
    command: `irm ${RELEASE}/install.ps1 | iex`,
    hint: 'Run in PowerShell 5.1 or newer. Requires Java 17 or newer.',
  },
  {
    id: 'skill',
    label: 'Agent skill',
    command: `curl -fsSL ${RELEASE}/skill-install.sh | bash`,
    hint: 'Adds the DMTools skill to your project for Cursor, Claude Code and Codex.',
  },
];

export const verifyCommand = 'dmtools list';

// ------------------------------------------------------------------ faq ----

export interface FaqEntry {
  question: string;
  answer: string;
  /** Opens the section on the definitional answer rather than a wall of closed rows. */
  open?: boolean;
}

/**
 * Objection-led, in the order a buyer raises them. Answers open with a
 * self-contained sentence naming DMTools rather than "it": the rest of the page
 * speaks in metaphor, which reads well and extracts badly, and this is the
 * section an assistant quotes.
 */
export const faq: FaqEntry[] = [
  {
    question: 'What is DMTools?',
    answer:
      'DMTools is an open-source command-line orchestrator that connects AI agents to enterprise delivery systems. It exposes 320+ tools across 20+ integrations — Jira, Azure DevOps, GitHub, GitLab, Confluence, Figma, Microsoft Teams and every major AI provider — behind a single CLI. DMTools is built and maintained by EPAM Systems and released under the Apache 2.0 licence.',
    open: true,
  },
  {
    question: 'Is our data sent to EPAM or to a DMTools service?',
    answer:
      'No. DMTools is a CLI you run inside your own CI pipeline or on your own machine, with your own credentials and your own choice of AI provider. There is no DMTools-operated backend in between, and no telemetry path back to EPAM.',
  },
  {
    question: 'Do I need to be a developer to benefit from DMTools?',
    answer:
      'No. One technical teammate installs and configures DMTools once per project — Java 17 or newer plus a set of environment variables. After that the output reaches delivery managers, QA and platform teams as processed tickets, drafted pull requests and generated reports, not as a tool anyone has to operate.',
  },
  {
    question: 'What happens if the AI gets something wrong?',
    answer:
      'Nothing merges on its own. Every branch and pull request DMTools produces stops for human review before it ships — the model drafts the work, your engineers approve and merge it. Because each run installs fresh and leaves its trail in CI, a wrong answer is auditable rather than mysterious.',
  },
  {
    question: 'Does DMTools only work with GitHub?',
    answer:
      'No. DMTools integrates with Jira, Azure DevOps, GitHub, GitLab, Bitbucket, Confluence, SharePoint, Figma, Microsoft Teams, TestRail, Jenkins and Bitrise — more than twenty systems in total. GitHub is one of them, not a requirement.',
  },
  {
    question: 'Which AI providers can we use?',
    answer:
      'DMTools supports Anthropic Claude, OpenAI, Google Gemini, Google Vertex AI, AWS Bedrock, the EPAM DIAL enterprise gateway, and fully local models through Ollama when code and tickets must never leave your network. The provider is chosen at runtime through environment variables, so switching takes no code change.',
  },
  {
    question: 'What does DMTools cost?',
    answer:
      'DMTools itself is free and open source under Apache 2.0 — no account, no licence key, no paid tier. You pay only the AI provider and the delivery tools your organisation already uses.',
  },
  {
    question: 'How is DMTools different from a single MCP server?',
    answer:
      'A typical MCP server wraps one system; DMTools covers more than twenty behind one install, and exposes them four ways — direct CLI calls, MCP for assistants such as Claude and Cursor, plain JavaScript functions inside jobs, and CI pipelines. Every tool is generated from annotated Java at compile time, so the CLI surface, the MCP schema and the JavaScript functions cannot drift apart.',
  },
];
