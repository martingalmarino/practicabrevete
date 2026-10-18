// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';
import { categorias } from './src/data/categorias.ts';

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
        if (url.includes('/og/') || url.endsWith('.txt')) return false;
        const match = url.match(/\/simulacro\/([^/]+)\//);
        if (match) {
          const slug = match[1];
          const cat = categorias.find((c) => c.slug === slug);
          if (cat && !cat.disponible) return false;
        }
        return true;
      },
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },
});
