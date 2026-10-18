import { site } from '../config/site';

const origin = () => site.url.replace(/\/+$/, '');

function normalizePath(pathname: string): string {
  let path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  path = path.split('?')[0]?.split('#')[0] ?? '/';
  return path;
}

/**
 * URL absoluta en el dominio canónico (`https://www.simulacrobrevete.pe`).
 * Sin trailing slash en rutas internas (salvo la home `/`).
 */
export function absoluteUrl(pathname = '/'): string {
  let path = normalizePath(pathname);

  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path === '/' ? `${origin()}/` : `${origin()}${path}`;
}

export function sitemapIndexUrl(): string {
  return `${origin()}/sitemap-index.xml`;
}
