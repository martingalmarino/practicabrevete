import { site } from '../config/site';

const origin = () => site.url.replace(/\/+$/, '');

function normalizePath(pathname: string): string {
  let path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  path = path.split('?')[0]?.split('#')[0] ?? '/';
  return path;
}

function looksLikeFile(path: string): boolean {
  const last = path.split('/').filter(Boolean).pop() ?? '';
  return /\.[a-z0-9]{2,8}$/i.test(last);
}

/**
 * URL absoluta en el dominio canónico (`https://practicabrevete.pe`).
 * Páginas con trailing slash (como el sitemap); archivos sin slash final.
 */
export function absoluteUrl(pathname = '/'): string {
  let path = normalizePath(pathname);

  if (path !== '/' && !looksLikeFile(path) && !path.endsWith('/')) {
    path = `${path}/`;
  }

  if (looksLikeFile(path) && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path === '/' ? `${origin()}/` : `${origin()}${path}`;
}

export function sitemapIndexUrl(): string {
  return `${origin()}/sitemap-index.xml`;
}
