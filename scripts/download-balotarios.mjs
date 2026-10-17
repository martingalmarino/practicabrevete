#!/usr/bin/env node
/**
 * Descarga los PDFs públicos de balotarios desde gob.pe.
 * Uso: npm run data:download
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'data', 'raw');

/** URLs públicas publicadas en gob.pe (informe 1928110) */
export const BALOTARIOS = [
  {
    id: 'a-i',
    label: 'Clase A categoría I',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897558/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20A%2C%20categor%C3%ADa%20I..pdf',
  },
  {
    id: 'a-iia',
    label: 'Clase A categoría II-A',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897561/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20A%2C%20categor%C3%ADa%20II-A..pdf',
  },
  {
    id: 'a-iib',
    label: 'Clase A categoría II-B',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897562/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20A%2C%20categor%C3%ADa%20II-B..pdf',
  },
  {
    id: 'a-iiia',
    label: 'Clase A categoría III-A',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897563/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20A%20-%20categor%C3%ADa%20III-A..pdf',
  },
  {
    id: 'a-iiib',
    label: 'Clase A categoría III-B',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897564/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20A%20-%20categor%C3%ADa%20III-B..pdf',
  },
  {
    id: 'a-iiic',
    label: 'Clase A categoría III-C',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897565/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20A%20-%20categor%C3%ADa%20III-C..pdf',
  },
  {
    id: 'b-iia',
    label: 'Clase B categoría II-A',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897559/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20B%2C%20categor%C3%ADa%20II-A..pdf',
  },
  {
    id: 'b-iib',
    label: 'Clase B categoría II-B',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897560/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20B%2C%20categor%C3%ADa%20II-B..pdf',
  },
  {
    id: 'b-iic',
    label: 'Clase B categoría II-C',
    url: 'https://cdn.www.gob.pe/uploads/document/file/1897566/Balotario%20de%20preguntas%20para%20examen%20de%20clase%20B%20-%20categor%C3%ADa%20II-C..pdf',
  },
];

async function downloadOne({ id, label, url }) {
  const file = join(outDir, `${id}.pdf`);
  process.stdout.write(`Descargando ${label} → ${id}.pdf ... `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} para ${id}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  console.log(`${(buf.length / 1024).toFixed(1)} KB`);
}

async function main() {
  const only = process.argv.slice(2);
  await mkdir(outDir, { recursive: true });
  const list = only.length
    ? BALOTARIOS.filter((b) => only.includes(b.id))
    : BALOTARIOS;
  for (const item of list) {
    await downloadOne(item);
  }
  console.log(`Listo. PDFs en ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
