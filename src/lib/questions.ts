import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Pregunta, TemaId } from '../data/tipos';
import aI from '../data/preguntas/a-i.json';
import bIIb from '../data/preguntas/b-iib.json';

const banks: Record<string, Pregunta[]> = {
  'a-i': aI as Pregunta[],
  'b-iib': bIIb as Pregunta[],
};

export function getBank(categoriaSlug: string): Pregunta[] {
  const rawBank = banks[categoriaSlug] ?? [];
  return rawBank.filter((q) => {
    if (!q.imagen?.src) return true;
    const publicPath = join(process.cwd(), 'public', q.imagen.src);
    return existsSync(publicPath);
  });
}

export function getAllQuestions(): Pregunta[] {
  return Object.values(banks).flat();
}

export function getPublishedQuestions(): Pregunta[] {
  return getAllQuestions().filter(
    (q) => q.publish && q.explicacion?.status === 'revisada' && q.explicacion.texto.length > 0,
  );
}

export function getQuestionBySlug(slug: string): Pregunta | undefined {
  return getPublishedQuestions().find((q) => q.slug === slug);
}

export function getQuestionsByTema(tema: TemaId, categoriaSlug = 'a-i'): Pregunta[] {
  return getBank(categoriaSlug).filter((q) => q.tema === tema);
}

export function getRelatedQuestions(question: Pregunta, limit = 4): Pregunta[] {
  return getPublishedQuestions()
    .filter((q) => q.id !== question.id && (q.tema === question.tema || q.categoria === question.categoria))
    .slice(0, limit);
}

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickExamQuestions(
  categoriaSlug: string,
  count: number,
  random: () => number = Math.random,
): Pregunta[] {
  const bank = getBank(categoriaSlug);
  if (bank.length === 0) return [];
  const shuffled = shuffle(bank, random);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
