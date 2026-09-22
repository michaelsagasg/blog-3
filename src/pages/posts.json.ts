import { getPosts, rawUrl, postUrl } from '../lib/site';

export const GET = async () => {
  const posts = await getPosts();
  return new Response(
    JSON.stringify(posts.map((p) => ({ id: p.id, ...p.data, url: postUrl(p), markdown: rawUrl(p) })), null, 2),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
