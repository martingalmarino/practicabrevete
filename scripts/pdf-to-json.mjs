#!/usr/bin/env node
/**
 * Convierte un balotario PDF (texto extraíble) a JSON de preguntas.
 * Uso: npm run data:parse -- a-i
 * Requiere: data/raw/<id>.pdf (npm run data:download)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractText, getDocumentProxy } from 'unpdf';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const CATEGORIA_MAP = {
  'a-i': 'A-I',
  'a-iia': 'A-IIa',
  'a-iib': 'A-IIb',
  'a-iiia': 'A-IIIa',
  'a-iiib': 'A-IIIb',
  'a-iiic': 'A-IIIc',
  'b-iia': 'B-IIa',
  'b-iib': 'B-IIb',
  'b-iic': 'B-IIc',
};

const HEADER_NOISE = [
  /LICENCIA DE CONDUCIR[\s\S]*?CATEGORÍA I[^\n]*/gi,
  /Nº\s*TIPO DE\s*MATERIA[\s\S]*?RESPUESTA/gi,
  /BALOTARIO DE PREGUNTAS[\s\S]*?\(Vehículos[^\)]*\)/gi,
  /DE CLASE A - CATEGORÍA I[^\n]*/gi,
  /Página\s*\d+\s*de\s*\d+/gi,
];

function cleanText(s) {
  return s
    .replace(/\u0000/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function joinBrokenLines(s) {
  return s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferTema(temaRaw, enunciado) {
  const t = `${temaRaw} ${enunciado}`.toLowerCase();
  if (/primeros auxilios|herido|hemorragia|rcp|inmoviliz|quemadura|sangrado/.test(t)) {
    return 'primeros-auxilios';
  }
  if (/\bsoat\b|licencia de conducir|documento|placa única|inspección técnica|citv|revisión técnica/.test(t)) {
    return 'documentos';
  }
  if (/velocidad máxima|km\/h|kilómetros por hora|límite de velocidad|exceso de velocidad/.test(t)) {
    return 'velocidades';
  }
  if (
    /prioridad|preferencia|rotonda|ceder el paso|adelantar|adelantamiento|intersección|choque|quien pasa primero/.test(
      t,
    )
  ) {
    return 'prioridad';
  }
  if (
    /freno|neumático|llanta|motor|luces del|cinturón|airbag|dirección|suspensión|mecánica|batería|aceite/.test(t)
  ) {
    return 'mecanica';
  }
  if (/señal|semáforo|pavimento|dispositivo de control|marca vial|r-\d|p-\d|línea amarilla/.test(t)) {
    return 'senales';
  }
  return 'prioridad';
}

function slugify(text, id) {
  const base = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return `${base || 'pregunta'}-${id}`;
}

function letterToIndex(letter) {
  const map = { a: 0, b: 1, c: 2, d: 3 };
  return map[letter.toLowerCase()] ?? -1;
}

/** Temas frecuentes del balotario A-I (columna TEMA del PDF). */
const KNOWN_THEMES = [
  'Reglamento de Tránsito y Manual de Dispositivos de Control de Tránsito',
  'Primeros Auxilios',
  'Mecánica Básica',
  'Reglamento Nacional de Vehículos',
  'Seguro Obligatorio de Accidentes de Tránsito',
  'Inspección Técnica Vehicular',
  'Reglamento de Placa Única Nacional de Rodaje',
  'Reglamento Nacional de Responsabilidad Civil y Seguros Obligatorios',
];

function parseBlock(num, block) {
  // Tras el split queda: " generales AI <tema> <pregunta> a) ..."
  let body = block
    .replace(/^\s*Materias\s*/i, '')
    .replace(/^\s*generales\s+AI\s*/i, '')
    .trim();

  const aMatch = body.match(/\ba\)\s/);
  if (!aMatch) return { error: 'sin a)', raw: body.slice(0, 200) };
  const aIdx = body.indexOf(aMatch[0]);

  const beforeOpts = body.slice(0, aIdx).trim();
  const optsAndAnswer = body.slice(aIdx).trim();

  const flat = joinBrokenLines(beforeOpts);
  let temaRaw = '';
  let enunciado = flat;

  const themeHit = KNOWN_THEMES.find((t) => flat.toLowerCase().startsWith(t.toLowerCase()));
  if (themeHit) {
    temaRaw = themeHit;
    enunciado = flat.slice(themeHit.length).trim();
  } else {
    // Fallback: primera oración larga en mayúscula / ¿ como inicio de pregunta
    const qStart = flat.search(/¿|[A-ZÁÉÍÓÚ][^.]{10,}[:?]|Está |Respecto |La señal |En las |Los |El |Una |Si |Cuando /);
    if (qStart > 0) {
      temaRaw = flat.slice(0, qStart).trim();
      enunciado = flat.slice(qStart).trim();
    }
  }

  enunciado = enunciado
    .replace(/^[:\-–]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Parse options a) b) c) d) and trailing answer letter
  const optRe =
    /^a\)\s*([\s\S]*?)\s*b\)\s*([\s\S]*?)\s*c\)\s*([\s\S]*?)\s*d\)\s*([\s\S]*?)\s*([a-d])\s*$/i;
  const m = optsAndAnswer.match(optRe);
  if (!m) {
    // Try without requiring answer at end — look for last lone letter
    const loose = optsAndAnswer.match(
      /^a\)\s*([\s\S]*?)\s*b\)\s*([\s\S]*?)\s*c\)\s*([\s\S]*?)\s*d\)\s*([\s\S]*)$/i,
    );
    if (!loose) return { error: 'opciones mal formadas', raw: optsAndAnswer.slice(0, 300) };
    const tail = loose[4].trim();
    const ansMatch = tail.match(/\s([a-d])\s*$/i);
    if (!ansMatch) return { error: 'sin respuesta', raw: optsAndAnswer.slice(0, 300) };
    const dText = tail.slice(0, ansMatch.index).trim();
    const correcta = letterToIndex(ansMatch[1]);
    const opciones = [loose[1], loose[2], loose[3], dText].map(joinBrokenLines);
    return buildQuestion(num, temaRaw, enunciado, opciones, correcta);
  }

  const opciones = [m[1], m[2], m[3], m[4]].map(joinBrokenLines);
  const correcta = letterToIndex(m[5]);
  return buildQuestion(num, temaRaw, enunciado, opciones, correcta);
}

function buildQuestion(num, temaRaw, enunciado, opciones, correcta) {
  const idNum = String(num).padStart(3, '0');
  const catSlug = process.env.CAT_SLUG || 'a-i';
  const categoria = CATEGORIA_MAP[catSlug] || 'A-I';
  const tema = inferTema(temaRaw, enunciado);
  const id = `${catSlug}-${idNum}`;
  return {
    id,
    categoria,
    tema,
    temaFuente: temaRaw || 'TODO: clasificar tema del balotario',
    enunciado,
    opciones,
    correcta,
    imagen: null,
    explicacion: {
      texto: '',
      status: 'revisar',
      baseLegal: 'TODO: verificar artículo del Reglamento Nacional de Tránsito',
    },
    slug: slugify(enunciado, id),
    publish: false,
    fuente: 'Balotario público clase A categoría I (gob.pe, publicación 1928110)',
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function splitQuestions(text) {
  let cleaned = text;
  for (const re of HEADER_NOISE) cleaned = cleaned.replace(re, '\n');
  cleaned = cleanText(cleaned);

  const parts = cleaned.split(/(?:^|\n)(?=\d{1,3}\s+Materias\s*\n?\s*generales\s+AI)/i);
  const questions = [];
  const errors = [];

  for (const part of parts) {
    const m = part.match(/^(\d{1,3})\s+Materias/);
    if (!m) continue;
    const num = Number(m[1]);
    const block = part.slice(m[0].length);
    const parsed = parseBlock(num, block);
    if (parsed.error) {
      errors.push({ num, ...parsed });
    } else {
      questions.push(parsed);
    }
  }
  return { questions, errors };
}

async function main() {
  const id = process.argv[2] || 'a-i';
  process.env.CAT_SLUG = id;
  const pdfPath = join(root, 'data', 'raw', `${id}.pdf`);
  const outDir = join(root, 'src', 'data', 'preguntas');
  await mkdir(outDir, { recursive: true });

  console.log(`Leyendo ${pdfPath}...`);
  const data = await readFile(pdfPath);
  const pdf = await getDocumentProxy(new Uint8Array(data));
  const { text } = await extractText(pdf, { mergePages: true });
  await writeFile(join(root, 'data', 'raw', `${id}.txt`), text, 'utf8');

  const { questions, errors } = splitQuestions(text);
  const outPath = join(outDir, `${id}.json`);
  await writeFile(outPath, JSON.stringify(questions, null, 2) + '\n', 'utf8');

  console.log(`Preguntas OK: ${questions.length}`);
  console.log(`Errores de parseo: ${errors.length}`);
  if (errors.length) {
    const errPath = join(root, 'data', 'raw', `${id}-parse-errors.json`);
    await writeFile(errPath, JSON.stringify(errors.slice(0, 50), null, 2));
    console.log(`Muestra de errores en ${errPath}`);
  }
  console.log(`Escrito: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
