import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { sitemapIndexUrl } from '../lib/urls';

export const GET: APIRoute = () => {
  const body = `# ${site.name}
# ${site.url}

User-agent: *
Allow: /

# Bots de búsqueda y asistentes (AEO)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Host canónico (Bing)
Host: ${site.domain}

Sitemap: ${sitemapIndexUrl()}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
