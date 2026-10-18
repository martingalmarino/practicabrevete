#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { compareTwoStrings } from 'string-similarity';

const text = await readFile('data/raw/a-iia.txt', 'utf8');
const aiQuestions = JSON.parse(await readFile('src/data/preguntas/a-i.json', 'utf8'));

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

function slugify(text, id) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) + '-' + id;
}

function letterToIndex(letter) {
  return { a: 0, b: 1, c: 2, d: 3 }[letter.toLowerCase()] ?? -1;
}

// Split parts
const secondPartIdx = text.indexOf('SEGUNDA PARTE - MATERIAS ESPECÍFICAS');
const part1Text = text.substring(0, secondPartIdx);
const part2Text = text.substring(secondPartIdx);

const questions = [];

// Extract question blocks from part 1 (general)
// Pattern: number at start of line followed by question ending with single letter answer
const generalBlocks = part1Text.split(/\n(?=\d{1,3} Materias\n)/g).filter(b => b.includes('Materias'));

for (const block of generalBlocks) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 5) continue;
  
  // First line should be number
  const firstLine = lines[0];
  const numMatch = firstLine.match(/^(\d{1,3})/);
  if (!numMatch) continue;
  const num = parseInt(numMatch[1]);
  
  // Last line should end with answer letter
  const lastLine = lines[lines.length - 1];
  const answerMatch = lastLine.match(/\s+([a-d])$/);
  if (!answerMatch) continue;
  const answer = answerMatch[1];
  
  // Join all lines and extract question text (after tema, before "a)")
  const fullText = lines.join(' ');
  
  // Extract question (everything from after Control de Tránsito / tema to before "a)")
  const questionMatch = fullText.match(/Control de Tránsito\s+(.+?)\s+a\)/i) ||
                        fullText.match(/Mecánica Automotriz\s+(.+?)\s+a\)/i) ||
                        fullText.match(/Seguridad Vial\s+(.+?)\s+a\)/i) ||
                        fullText.match(/Medio Ambiente\s+(.+?)\s+a\)/i) ||
                        fullText.match(/Salud\s+(.+?)\s+a\)/i);
  
  if (!questionMatch) continue;
  const questionText = questionMatch[1].trim();
  
  // Extract options
  const optionsMatch = fullText.match(/a\)\s+(.+?)\s+b\)\s+(.+?)\s+c\)\s+(.+?)\s+d\)\s+(.+?)\s+[a-d]$/i);
  if (!optionsMatch) continue;
  
  const opciones = [
    optionsMatch[1].trim(),
    optionsMatch[2].trim(), 
    optionsMatch[3].trim(),
    optionsMatch[4].trim()
  ];
  
  const correcta = letterToIndex(answer);
  if (correcta === -1) continue;
  
  // Fuzzy match with A-I
  const normQ = normalize(questionText);
  let bestMatch = null;
  let bestScore = 0;
  
  for (const aiQ of aiQuestions) {
    const score = compareTwoStrings(normQ, normalize(aiQ.enunciado));
    if (score > bestScore) {
      bestScore = score;
      bestMatch = aiQ;
    }
  }
  
  // Use A-I if match is good (>0.8)
  const useAI = bestMatch && bestScore > 0.8;
  
  const idNum = String(num).padStart(3, '0');
  const id = `a-iia-${idNum}`;
  
  questions.push({
    id,
    categoria: 'A-IIa',
    tema: useAI ? bestMatch.tema : 'prioridad',
    enunciado: useAI ? bestMatch.enunciado : questionText,
    opciones: useAI ? bestMatch.opciones : opciones,
    correcta: useAI ? bestMatch.correcta : correcta,
    imagen: useAI ? bestMatch.imagen : null,
    explicacion: useAI ? bestMatch.explicacion : {
      texto: '',
      status: 'revisar',
      baseLegal: 'TODO: verificar artículo',
    },
    slug: useAI ? bestMatch.slug.replace(/^a-i-/, 'a-iia-') : slugify(questionText, id),
    publish: useAI && bestMatch.publish,
    fuente: 'Balotario público clase A categoría II-a (gob.pe, RD 004-2020-MTC/18, 17/05/2021)',
    updatedAt: new Date().toISOString().slice(0, 10),
    tipo: 'general',
    _matchScore: bestScore,
  });
}

// Extract specific questions from part 2
const specificBlocks = part2Text.split(/\n(?=\d{1,3} Materias\n)/g).filter(b => b.includes('especificas'));

for (const block of specificBlocks) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 5) continue;
  
  const firstLine = lines[0];
  const numMatch = firstLine.match(/^(\d{1,3})/);
  if (!numMatch) continue;
  const num = parseInt(numMatch[1]);
  
  const lastLine = lines[lines.length - 1];
  const answerMatch = lastLine.match(/\s+([a-d])(?:\s|$)/);
  if (!answerMatch) continue;
  const answer = answerMatch[1];
  
  const fullText = lines.join(' ');
  
  // Extract question from specific format
  const questionMatch = fullText.match(/transporte\s+(.+?)\s+a\)/i);
  if (!questionMatch) continue;
  const questionText = questionMatch[1].trim();
  
  const optionsMatch = fullText.match(/a\)\s*(.+?)\s+b\)\s*(.+?)\s+c\)\s*(.+?)\s+d\)\s*(.+?)\s+[a-d](?:\s|$)/i);
  if (!optionsMatch) continue;
  
  const opciones = [
    optionsMatch[1].trim(),
    optionsMatch[2].trim(),
    optionsMatch[3].trim(),
    optionsMatch[4].trim()
  ];
  
  const correcta = letterToIndex(answer);
  if (correcta === -1) continue;
  
  const idNum = String(500 + num).padStart(3, '0');
  const id = `a-iia-${idNum}`;
  
  questions.push({
    id,
    categoria: 'A-IIa',
    tema: 'documentos',
    enunciado: questionText,
    opciones,
    correcta,
    imagen: null,
    explicacion: {
      texto: '',
      status: 'revisar',
      baseLegal: 'TODO: verificar artículo',
    },
    slug: slugify(questionText, id),
    publish: false,
    fuente: 'Balotario público clase A categoría II-a (gob.pe, RD 004-2020-MTC/18, 17/05/2021)',
    updatedAt: new Date().toISOString().slice(0, 10),
    tipo: 'especifica',
  });
}

// Sort by id and remove match score
questions.sort((a, b) => a.id.localeCompare(b.id));
questions.forEach(q => delete q._matchScore);

await writeFile('src/data/preguntas/a-iia.json', JSON.stringify(questions, null, 2));

const general = questions.filter(q => q.tipo === 'general');
const specific = questions.filter(q => q.tipo === 'especifica');
const withImg = general.filter(q => q.imagen !== null);
const published = questions.filter(q => q.publish);

console.log(`✅ Total: ${questions.length} preguntas`);
console.log(`   Generales: ${general.length} (${withImg.length} con imagen, ${published.length} publicables)`);
console.log(`   Específicas: ${specific.length}`);
