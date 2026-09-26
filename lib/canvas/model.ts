/** Canvas domain model: pure data and functions, no React. */
export const GRID = 24;
export const NODE_W = 216; // 9 grid cells
export const NODE_H = 72; // 3 grid cells

export type NodeKind =
  | 'website'
  | 'instagram'
  | 'whatsapp'
  | 'messenger'
  | 'knowledge'
  | 'agent'
  | 'crm'
  | 'handoff'
  | 'calendar'
  | 'email';

export type NodeCategory = 'channel' | 'intelligence' | 'action';

export interface KindMeta {
  label: string;
  hint: string;
  category: NodeCategory;
  inputs: boolean;
  outputs: boolean;
}

export const KINDS: Record<NodeKind, KindMeta> = {
  website: { label: 'Website chat', hint: 'Widget on your site', category: 'channel', inputs: false, outputs: true },
  instagram: { label: 'Instagram DMs', hint: 'Messages and story replies', category: 'channel', inputs: false, outputs: true },
  whatsapp: { label: 'WhatsApp Business', hint: 'Your business number', category: 'channel', inputs: false, outputs: true },
  messenger: { label: 'Messenger', hint: 'Facebook Page inbox', category: 'channel', inputs: false, outputs: true },
  knowledge: { label: 'Knowledge base', hint: 'Docs, FAQs, catalog', category: 'intelligence', inputs: false, outputs: true },
  agent: { label: 'AI agent', hint: 'Answers, qualifies, routes', category: 'intelligence', inputs: true, outputs: true },
  crm: { label: 'CRM', hint: 'Creates and updates leads', category: 'action', inputs: true, outputs: false },
  handoff: { label: 'Human handoff', hint: 'Alerts your team', category: 'action', inputs: true, outputs: false },
  calendar: { label: 'Calendar', hint: 'Books meetings', category: 'action', inputs: true, outputs: false },
  email: { label: 'Email follow-up', hint: 'Sends summaries', category: 'action', inputs: true, outputs: false },
};

export const CATEGORIES: ReadonlyArray<{ id: NodeCategory; label: string; kinds: NodeKind[] }> = [
  { id: 'channel', label: 'Channels', kinds: ['website', 'instagram', 'whatsapp', 'messenger'] },
  { id: 'intelligence', label: 'Intelligence', kinds: ['agent', 'knowledge'] },
  { id: 'action', label: 'Actions', kinds: ['crm', 'handoff', 'calendar', 'email'] },
];

/** Logo gradient per category (see app/globals.css :root). */
export const CATEGORY_GRADIENT: Record<NodeCategory, string> = {
  channel: 'var(--gradient-wire)',
  intelligence: 'var(--gradient-pulse)',
  action: 'var(--gradient-link)',
};

export interface CanvasNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
}
export interface CanvasEdge {
  id: string;
  from: string;
  to: string;
}
export interface CanvasDoc {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}
export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
export interface Point {
  x: number;
  y: number;
}

export const snap = (value: number) => Math.round(value / GRID) * GRID;

export function uid(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
  return `${prefix}_${random}`;
}

export const outPort = (n: CanvasNode): Point => ({ x: n.x + NODE_W, y: n.y + NODE_H / 2 });
export const inPort = (n: CanvasNode): Point => ({ x: n.x, y: n.y + NODE_H / 2 });

export function canConnect(doc: CanvasDoc, from: string, to: string): boolean {
  if (from === to) return false;
  const a = doc.nodes.find((n) => n.id === from);
  const b = doc.nodes.find((n) => n.id === to);
  if (!a || !b || !KINDS[a.kind].outputs || !KINDS[b.kind].inputs) return false;
  return !doc.edges.some((e) => e.from === from && e.to === to);
}

export function nodesBounds(nodes: CanvasNode[]): Bounds | null {
  if (!nodes.length) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + NODE_W);
    maxY = Math.max(maxY, n.y + NODE_H);
  }
  return { minX, minY, maxX, maxY };
}

export function createTemplate(): CanvasDoc {
  const nodes: CanvasNode[] = [
    { id: 'n_website', kind: 'website', x: 0, y: 0 },
    { id: 'n_instagram', kind: 'instagram', x: 0, y: 120 },
    { id: 'n_whatsapp', kind: 'whatsapp', x: 0, y: 240 },
    { id: 'n_agent', kind: 'agent', x: 336, y: 120 },
    { id: 'n_knowledge', kind: 'knowledge', x: 336, y: 312 },
    { id: 'n_crm', kind: 'crm', x: 672, y: 0 },
    { id: 'n_handoff', kind: 'handoff', x: 672, y: 120 },
    { id: 'n_calendar', kind: 'calendar', x: 672, y: 240 },
  ];
  const link = (from: string, to: string): CanvasEdge => ({ id: `e_${from}_${to}`, from, to });
  return {
    nodes,
    edges: [
      link('n_website', 'n_agent'),
      link('n_instagram', 'n_agent'),
      link('n_whatsapp', 'n_agent'),
      link('n_knowledge', 'n_agent'),
      link('n_agent', 'n_crm'),
      link('n_agent', 'n_handoff'),
      link('n_agent', 'n_calendar'),
    ],
  };
}

/**
 * Plain-language description of the map. Defaults to English (used in the team email);
 * the booking page passes translated labels for what the visitor sees.
 */
export function summarizeDoc(
  doc: CanvasDoc,
  label: (kind: NodeKind) => string = (kind) => KINDS[kind].label,
  notConnected: (list: string) => string = (list) => `Not connected yet: ${list}`,
): string[] {
  const byId = new Map(doc.nodes.map((n) => [n.id, n]));
  const lines: string[] = [];
  for (const node of doc.nodes) {
    const targets = doc.edges
      .filter((e) => e.from === node.id)
      .map((e) => byId.get(e.to))
      .filter((n): n is CanvasNode => Boolean(n))
      .map((n) => label(n.kind));
    if (targets.length) lines.push(`${label(node.kind)} → ${targets.join(', ')}`);
  }
  const loose = doc.nodes.filter((n) => !doc.edges.some((e) => e.from === n.id || e.to === n.id));
  if (loose.length) lines.push(notConnected(loose.map((n) => label(n.kind)).join(', ')));
  return lines;
}

function isNode(value: unknown): value is CanvasNode {
  const n = value as Partial<CanvasNode> | null;
  return (
    !!n &&
    typeof n.id === 'string' &&
    typeof n.kind === 'string' &&
    Object.prototype.hasOwnProperty.call(KINDS, n.kind) &&
    Number.isFinite(n.x) &&
    Number.isFinite(n.y)
  );
}

function isEdge(value: unknown): value is CanvasEdge {
  const e = value as Partial<CanvasEdge> | null;
  return !!e && typeof e.id === 'string' && typeof e.from === 'string' && typeof e.to === 'string';
}

/** Defensive parse for data coming back from localStorage. */
export function parseDoc(input: unknown): CanvasDoc | null {
  if (!input || typeof input !== 'object') return null;
  const { nodes, edges } = input as { nodes?: unknown; edges?: unknown };
  if (!Array.isArray(nodes) || !Array.isArray(edges)) return null;
  const validNodes = nodes.filter(isNode).slice(0, 300);
  const ids = new Set(validNodes.map((n) => n.id));
  const validEdges = edges.filter(isEdge).filter((e) => ids.has(e.from) && ids.has(e.to));
  return { nodes: validNodes, edges: validEdges };
}
