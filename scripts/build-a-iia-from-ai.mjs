#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

// A-IIa Part 1 (general) = exact copy of A-I (200 questions)
// A-IIa Part 2 (specific) = need to parse from PDF

const aiQuestions = JSON.parse(await readFile('src/data/preguntas/a-i.json', 'utf8'));
const text = await readFile('data/raw/a-iia.txt', 'utf8');

// Clone A-I questions for A-IIa general part
const general = aiQuestions.map((q, idx) => {
  const idNum = String(idx + 1).padStart(3, '0');
  return {
    ...q,
    id: `a-iia-${idNum}`,
    categoria: 'A-IIa',
    slug: q.slug.replace(/^a-i-/, 'a-iia-'),
    fuente: 'Balotario público clase A categoría II-a (gob.pe, RD 004-2020-MTC/18, 17/05/2021)',
    tipo: 'general',
  };
});

// Parse specific questions from SEGUNDA PARTE
const specificSection = text.split('SEGUNDA PARTE - MATERIAS ESPECÍFICAS')[1];
const lines = specificSection.split('\\n');

const specific = [];
let currentQ = null;
let buffer = [];

function slugify(text, id) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) + '-' + id;
}

function letterToIndex(letter) {
  return { a: 0, b: 1, c: 2, d: 3 }[letter?.toLowerCase()] ?? -1;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Check if this is a new question (starts with number + "Materias especificas")
  if (/^\d{1,3} Materias/.test(line)) {
    // Save previous question if exists
    if (currentQ && buffer.length > 0) {
      const text = buffer.join(' ');
      // Extract enunciado and options from buffered text
      const match = text.match(/transporte\s+(.+?)\s+a\)\s*(.+?)\s+b\)\s*(.+?)\s+c\)\s*(.+?)\s+d\)\s*(.+?)\s+([a-d])(?:\s|$)/i);
      if (match) {
        const enunciado = match[1].trim();
        const opciones = [match[2], match[3], match[4], match[5]].map(o => o.trim());
        const correcta = letterToIndex(match[6]);
        
        if (correcta !== -1) {
          const idNum = String(500 + currentQ).padStart(3, '0');
          const id = `a-iia-${idNum}`;
          specific.push({
            id,
            categoria: 'A-IIa',
            tema: 'documentos',
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
      }
    }
    
    // Start new question
    const numMatch = line.match(/^(\d{1,3})/);
    currentQ = numMatch ? parseInt(numMatch[1]) : null;
    buffer = [line];
  } else if (currentQ !== null) {
    buffer.push(line);
  }
}

// Process last question
if (currentQ && buffer.length > 0) {
  const text = buffer.join(' ');
  const match = text.match(/transporte\s+(.+?)\s+a\)\s*(.+?)\s+b\)\s*(.+?)\s+c\)\s*(.+?)\s+d\)\s*(.+?)\s+([a-d])(?:\s|$)/i);
  if (match) {
    const enunciado = match[1].trim();
    const opciones = [match[2], match[3], match[4], match[5]].map(o => o.trim());
    const correcta = letterToIndex(match[6]);
    
    if (correcta !== -1) {
      const idNum = String(500 + currentQ).padStart(3, '0');
      const id = `a-iia-${idNum}`;
      specific.push({
        id,
        categoria: 'A-IIa',
        tema: 'documentos',
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
  }
}

const questions = [...general, ...specific];
await writeFile('src/data/preguntas/a-iia.json', JSON.stringify(questions, null, 2));

const withImg = general.filter(q => q.imagen !== null);
const published = general.filter(q => q.publish);

console.log(`✅ Total: ${questions.length} preguntas`);
console.log(`   Generales: ${general.length} (${withImg.length} con imagen, ${published.length} publicables)`);
console.log(`   Específicas: ${specific.length}`);
