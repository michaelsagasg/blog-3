import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { getPosts } from '../../lib/site';

export async function getStaticPaths() {
  return (await getPosts()).map((post) => ({ params: { id: post.id }, props: { file: post.filePath! } }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await readFile(props.file as string, 'utf8'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
