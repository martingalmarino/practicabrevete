// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    preact(),
    mdx(),
    sitemap({
      filter: (page) => {
        const url = page.replace(site.url, '');
        return !url.includes('/og/') && !url.endsWith('.txt');
      },
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },
});
