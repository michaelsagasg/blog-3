import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  server: { host: '127.0.0.1', port: 4323 },
  site: 'https://peptidechill.co.uk',
  integrations: [sitemap()],
});
