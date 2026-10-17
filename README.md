# Practica Brevete

Simulador estático (Astro + Tailwind + Preact) del examen de reglas de tránsito para el brevete en Perú. Sitio **independiente**, no oficial.

- Dominio configurado: `practicabrevete.pe`
- Contacto: `contacto@practicabrevete.pe`
- Configuración central: [`src/config/site.ts`](src/config/site.ts)

## Requisitos

- Node.js 22+
- npm

## Cómo correr

```bash
npm install
npm run dev
```

Abre `http://localhost:4321`.

```bash
npm run build    # genera ./dist
npm run preview  # sirve el build
```

Despliegue en Vercel: importar el repo; el output es estático (`output: 'static'`). Incluye [`vercel.json`](vercel.json) con cabeceras básicas.

## Marca y reglas del examen

Edita [`src/config/site.ts`](src/config/site.ts):

| Campo | Uso |
|--------|-----|
| `name`, `url`, `email` | Marca y contacto |
| `bancoPreguntasYear` | Año de referencia del balotario |
| `examRules` | 40 preguntas, 35 para aprobar, 40 minutos |
| `adsense.clientId` / `slots` | Activar anuncios |
| `analytics.ga4Id` | Activar GA4 |

## Actualizar el banco de preguntas

Los PDFs oficiales están en gob.pe ([publicación 1928110](https://www.gob.pe/institucion/mtc/informes-publicaciones/1928110-examen-de-conocimientos-para-postulantes-a-licencias-de-conducir)).

```bash
# 1) Descargar balotarios a data/raw/ (gitignored)
npm run data:download
# o solo A-I:
node scripts/download-balotarios.mjs a-i

# 2) Convertir PDF → JSON en src/data/preguntas/<id>.json
npm run data:parse -- a-i

# 3) Rellenar borradores de explicación (status: revisar) y aplicar curadas
npm run data:explicaciones -- a-i
```

Flujo editorial:

1. El parseo deja `explicacion.status: "revisar"`, `publish: false` y `baseLegal` con TODO si no hay artículo.
2. Redacta o valida explicaciones (40–80 palabras) en [`scripts/draft-explicaciones.mjs`](scripts/draft-explicaciones.mjs) (objeto `CURATED`) o editando el JSON.
3. Solo las preguntas con `status: "revisada"` y `publish: true` generan `/pregunta/<slug>`.
4. Clasificación por tema (`senales`, `prioridad`, etc.) es heurística; ajústala a mano si hace falta.

Otras categorías: descarga el PDF (`a-iia`, `b-iic`, …), parsea y marca `disponible: true` en [`src/data/categorias.ts`](src/data/categorias.ts). Importa el JSON en [`src/lib/questions.ts`](src/lib/questions.ts).

## Activar Google AdSense

1. Completa el checklist en [`ADSENSE-CHECKLIST.md`](ADSENSE-CHECKLIST.md).
2. En `src/config/site.ts` pon tu `adsense.clientId` (`ca-pub-…`) y los IDs de `slots`.
3. En [`public/ads.txt`](public/ads.txt) reemplaza `pub-XXXXXXXXXXXXXXXX` por tu publisher ID.
4. Redesplegar. Los `AdSlot` tienen altura mínima reservada (sin CLS); sin `clientId` no cargan el script.

## Activar GA4

Pon `analytics.ga4Id` (ej. `G-XXXX`) en `site.ts`. Eventos emitidos por el simulacro:

- `inicio_simulacro`
- `fin_simulacro` (aprobado/desaprobado, puntaje)
- `click_explicacion`
- `repaso_errores`

## Estructura útil

```text
src/config/site.ts          # marca, examen, ads, GA4
src/data/preguntas/         # bancos JSON
src/content/guias/          # guías MDX (800+ palabras)
src/components/quiz/        # isla Preact
scripts/                    # download / parse / explicaciones
public/llms.txt             # resumen para asistentes
public/ads.txt              # plantilla AdSense
```

## Aviso legal breve

No usamos escudos ni logos oficiales. El footer, `/acerca` y `/aviso-legal` declaran que el sitio es independiente. Las preguntas salen de balotarios públicos; las explicaciones son propias.
