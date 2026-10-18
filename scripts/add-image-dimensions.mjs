#!/usr/bin/env node
/**
 * Agrega dimensiones (width/height) a las imágenes de preguntas para prevenir CLS.
 * Uso: node scripts/add-image-dimensions.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const BANKS = ['a-i', 'b-iib'];

async function getImageDimensions(imagePath) {
  if (!existsSync(imagePath)) {
    return null;
  }

  try {
    // Para SVG, usar sharp con metadata
    if (imagePath.endsWith('.svg')) {
      const metadata = await sharp(imagePath).metadata();
      return { width: metadata.width, height: metadata.height };
    }
    
    // Para PNG/JPG
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.error(`Error leyendo ${imagePath}:`, error.message);
    return null;
  }
}

async function processBank(bankSlug) {
  const bankPath = `src/data/preguntas/${bankSlug}.json`;
  console.log(`\nProcesando ${bankSlug}...`);
  
  const preguntas = JSON.parse(await readFile(bankPath, 'utf-8'));
  let modified = 0;
  let skipped = 0;

  for (const pregunta of preguntas) {
    if (!pregunta.imagen?.src) {
      continue;
    }

    // Si ya tiene dimensiones, skip
    if (pregunta.imagen.width && pregunta.imagen.height) {
      skipped++;
      continue;
    }

    const imagePath = join('public', pregunta.imagen.src);
    const dimensions = await getImageDimensions(imagePath);

    if (dimensions) {
      pregunta.imagen.width = dimensions.width;
      pregunta.imagen.height = dimensions.height;
      modified++;
      console.log(`  ✓ ${pregunta.id}: ${dimensions.width}×${dimensions.height}`);
    } else {
      console.log(`  ✗ ${pregunta.id}: imagen no encontrada o error`);
    }
  }

  await writeFile(bankPath, JSON.stringify(preguntas, null, 2) + '\n', 'utf-8');
  console.log(`\n${bankSlug}: ${modified} actualizadas, ${skipped} ya tenían dimensiones`);
  return { modified, skipped };
}

async function main() {
  console.log('Agregando dimensiones a imágenes de preguntas...\n');
  
  let totalModified = 0;
  let totalSkipped = 0;

  for (const bank of BANKS) {
    const { modified, skipped } = await processBank(bank);
    totalModified += modified;
    totalSkipped += skipped;
  }

  console.log(`\n✅ Total: ${totalModified} actualizadas, ${totalSkipped} ya tenían dimensiones`);
}

main().catch(console.error);
