import { getCollection, type CollectionEntry } from 'astro:content';
import config from '../../site.config.json';

export const site = config;
export type Post = CollectionEntry<'posts'>;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // '' at the domain root, '/coldchainuk' under a subpath
export const withBase = (p: string) => BASE + p;
export const stripBase = (pathname: string) => (BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname);

export const folderOf = (p: Post) => p.id.split('/').slice(0, -1).join('/');
export const slugOf = (p: Post) => p.id.split('/').pop() as string;
export const postUrl = (p: Post) => withBase(`/posts/${p.id}/`);

const utm = `utm_source=${site.slug}&utm_medium=blog`;
export const bannerHref = (url: string) => url + (url.includes('?') ? '&' : '?') + utm;

export const orgJsonLd = (origin: string | URL) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: new URL(withBase('/'), origin).href,
});

export const articleJsonLd = (post: Post) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.data.title,
  description: post.data.description,
  datePublished: post.data.date.toISOString(),
  author: { '@type': 'Organization', name: site.name },
  publisher: { '@type': 'Organization', name: site.name },
});

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export function countBy(posts: Post[], key: (p: Post) => string): [string, number][] {
  const m = new Map<string, number>();
  for (const p of posts) m.set(key(p), (m.get(key(p)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const readingTime = (p: Post) => Math.max(1, Math.round((p.body ?? '').split(/\s+/).filter(Boolean).length / 220));
export const rawUrl = (p: Post) => withBase(`/posts/${p.id}.md`);

export const catLabel = (c: string) => {
  const t = c.replace(/-/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const CAT_BLURB: Record<string, string> = {
  sourcing: 'Suppliers who actually ship cold, and how to tell before you order.',
  usage: 'Storage temperatures, reconstituted shelf life, and handling once it arrives.',
  'general-info': 'Why peptides need the cold chain in the first place.',
};
const CAT_SHORT: Record<string, string> = { 'general-info': 'Basics' };
export const catShort = (c: string) => CAT_SHORT[c] ?? catLabel(c);

export const catBlurb = (c: string) => CAT_BLURB[c] ?? 'Guides from the archive.';

// Cold-chain tones: steel-grey for sourcing (the supplier/logistics side), safety-orange for
// usage (the box you actually open), muted moss for general-info -- no blue/teal gradients.
const TONES = ['steel', 'orange', 'moss'] as const;
const CAT_TONE: Record<string, (typeof TONES)[number]> = { sourcing: 'steel', usage: 'orange', 'general-info': 'moss' };
export const catTone = (c: string) => CAT_TONE[c] ?? TONES[[...c].reduce((n, ch) => n + ch.charCodeAt(0), 0) % TONES.length];

// A temperature-gauge tag stands in for blog-1's element-letter device -- this blog's motif is
// the insulated box and its thermometer, not the periodic table or a dose ladder.
const CAT_TAG: Record<string, string> = { sourcing: 'UK', usage: '4°', 'general-info': 'Kb' };
export const catSymbol = (c: string) => {
  if (CAT_TAG[c]) return CAT_TAG[c];
  const l = c.replace(/[^a-z]/gi, '');
  return l.charAt(0).toUpperCase() + l.charAt(1).toLowerCase();
};
