#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

const text = await readFile('data/raw/a-iia.txt', 'utf8');
const aiQuestions = JSON.parse(await readFile('src/data/preguntas/a-i.json', 'utf8'));

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

function findMatchingAI(enunciado) {
  const normEnunciado = normalize(enunciado);
  return aiQuestions.find(q => normalize(q.enunciado) === normEnunciado);
}

function slugify(text, id) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) + '-' + id;
}

function letterToIndex(letter) {
  return { a: 0, b: 1, c: 2, d: 3 }[letter.toLowerCase()] ?? -1;
}

// Split into two parts
const parts = text.split(/SEGUNDA PARTE - MATERIAS ESPECÍFICAS/i);
const part1Text = parts[0];
const part2Text = parts[1] || '';

const questions = [];

// Parse general questions (part 1) - match table format
const generalMatches = [...part1Text.matchAll(/^(\d{1,3})\s+Materias\s+generales\s+Todas\s+(.*?)\s+(.*?)\s+a\)\s+(.*?)\s+b\)\s+(.*?)\s+c\)\s+(.*?)\s+d\)\s+(.*?)\s+([a-d])\s*$/gms)];

for (const match of generalMatches) {
  const [, numStr, tema, pregunta, opt1, opt2, opt3, opt4, respuesta] = match;
  const num = parseInt(numStr);
  
  const enunciado = pregunta.replace(/\s+/g, ' ').trim();
  const opciones = [opt1, opt2, opt3, opt4].map(o => o.replace(/\s+/g, ' ').trim());
  const correcta = letterToIndex(respuesta);
  
  if (correcta === -1) continue;
  
  const idNum = String(num).padStart(3, '0');
  const id = `a-iia-${idNum}`;
  
  // Try to match with A-I
  const aiMatch = findMatchingAI(enunciado);
  
  questions.push({
    id,
    categoria: 'A-IIa',
    tema: aiMatch?.tema || 'prioridad',
    temaFuente: tema.trim(),
    enunciado,
    opciones,
    correcta,
    imagen: aiMatch?.imagen || null,
    explicacion: aiMatch?.explicacion || {
      texto: '',
      status: 'revisar',
      baseLegal: 'TODO: verificar artículo',
    },
    slug: slugify(enunciado, id),
    publish: !!aiMatch,
    fuente: 'Balotario público clase A categoría II-a (gob.pe, RD 004-2020-MTC/18, 17/05/2021)',
    updatedAt: new Date().toISOString().slice(0, 10),
    tipo: 'general',
  });
}

// Parse specific questions (part 2)
const specificMatches = [...part2Text.matchAll(/^(\d{1,3})\s+Materias\s+especificas\s+AIIA\s+(.*?)\s+(.*?)\s+a\)\s*(.*?)\s+b\)\s*(.*?)\s+c\)\s*(.*?)\s+d\)\s*(.*?)\s+([a-d])\s/gms)];

for (const match of specificMatches) {
  const [, numStr, tema, pregunta, opt1, opt2, opt3, opt4, respuesta] = match;
  const num = parseInt(numStr);
  
  const enunciado = pregunta.replace(/\s+/g, ' ').trim();
  const opciones = [opt1, opt2, opt3, opt4].map(o => o.replace(/\s+/g, ' ').trim());
  const correcta = letterToIndex(respuesta);
  
  if (correcta === -1) continue;
  
  // Use 500+ range for specific questions to avoid ID conflicts
  const idNum = String(500 + num).padStart(3, '0');
  const id = `a-iia-${idNum}`;
  
  questions.push({
    id,
    categoria: 'A-IIa',
    tema: 'documentos',
    temaFuente: tema.trim(),
    enunciado,
    opciones,
    correcta,
    imagen: null,
    explicacion: {
      texto: '',
      status: 'revisar',
      baseLegal: 'TODO: verificar artículo',
    },
    slug: slugify(enunciado, id),
    publish: false,
    fuente: 'Balotario público clase A categoría II-a (gob.pe, RD 004-2020-MTC/18, 17/05/2021)',
    updatedAt: new Date().toISOString().slice(0, 10),
    tipo: 'especifica',
  });
}

await writeFile('src/data/preguntas/a-iia.json', JSON.stringify(questions, null, 2) + '\\n');

const general = questions.filter(q => q.tipo === 'general');
const specific = questions.filter(q => q.tipo === 'especifica');
const withImg = general.filter(q => q.imagen !== null);

console.log(`✅ Total: ${questions.length} preguntas`);
console.log(`  Generales: ${general.length} (${withImg.length} con imagen de A-I)`);
console.log(`  Específicas: ${specific.length}`);
