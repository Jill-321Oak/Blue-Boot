// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // Update when domain is set
  output: 'static',
  vite: {
    resolve: {
      alias: {
        '@data': new URL('../data', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'),
      },
    },
  },
});
