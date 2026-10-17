# Checklist antes de pedir AdSense

Úsalo cuando el dominio ya esté en producción. Objetivo: contenido de valor, pocas páginas pero únicas, y señales de sitio legítimo (como la referencia argentina de un solo tema + herramienta útil).

## Contenido (mínimo día 1)

- [ ] Al menos **10 URLs propias** indexables con texto real (home, 6 guías, acerca, legales, simulacro/práctica con copy único).
- [ ] Guías con **800+ palabras**, respuesta directa al inicio, H2 en forma de pregunta, fecha y fuente citada.
- [ ] Simulacro A-I funcional (40 preguntas, umbral 35, explicación / repaso).
- [ ] Páginas legales: `/privacidad` (AdSense + cookies), `/terminos`, `/aviso-legal`, `/contacto` con email del dominio.
- [ ] Disclaimer visible: sitio **independiente, no oficial** (footer + acerca + aviso-legal).
- [ ] Sin páginas en serie casi iguales (por ciudad/departamento).
- [ ] Sin inventar reseñas, precios ni horarios; datos no verificados marcados con TODO.

## Técnico SEO

- [ ] Dominio propio `.pe` con HTTPS.
- [ ] Títulos y metas únicos; canonical correcto (`site.url` en `site.ts`).
- [ ] `sitemap-index.xml` generado y enviado en Google Search Console.
- [ ] `robots.txt` accesible; permite rastreo (incluye GPTBot, PerplexityBot, Google-Extended, ClaudeBot).
- [ ] `llms.txt` publicado.
- [ ] Search Console: propiedad verificada, sitemap enviado, sin errores críticos de cobertura.
- [ ] Dominio con **2–3 semanas** de indexación y tráfico orgánico/navegación real antes de aplicar (recomendación práctica).

## AdSense / UX

- [ ] `ads.txt` con tu publisher ID real (no la plantilla `pub-XXXXXXXX`).
- [ ] `adsense.clientId` y slots en `src/config/site.ts` solo cuando vayas a activar anuncios.
- [ ] Espacios con altura reservada (componentes `AdSlot`) — sin CLS al cargar.
- [ ] Navegación clara; móvil usable; contraste razonable.
- [ ] Política de privacidad menciona AdSense y cookies de terceros.

## Calidad del banco

- [ ] Preguntas alineadas al balotario público (PDF gob.pe).
- [ ] Explicaciones revisadas antes de `publish: true`.
- [ ] Enlaces a fuentes oficiales en acerca / guías.

## Justo antes de enviar la solicitud

- [ ] Navega el sitio como usuario nuevo: ¿se entiende en 10 segundos?
- [ ] No hay placeholders visibles (“lorem”, “TODO” en páginas publicadas críticas).
- [ ] Email del dominio responde.
- [ ] Redesplegaste tras cambiar `ads.txt` y privacidad.

## Tras la aprobación

1. Pegar `ca-pub-…` y slots en `site.ts`.
2. Actualizar `ads.txt`.
3. Verificar en Search Console / AdSense que el sitio sigue cumpliendo políticas.
4. Activar GA4 si aún no está y revisar eventos del simulacro.
