import { useEffect, useMemo, useState } from 'preact/hooks';
import type { QuizQuestion } from './types';
import { QuestionCard } from './QuestionCard';
import { clearErrores, loadProgress } from '../../lib/progress';
import { trackRepasoErrores } from '../../lib/analytics';

interface Props {
  questions: QuizQuestion[];
}

export default function ReviewApp({ questions }: Props) {
  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const p = loadProgress();
    const ids = p.errores.map((e) => e.preguntaId);
    setErrorIds(ids);
    if (ids.length) trackRepasoErrores(ids.length);
  }, []);

  const list = useMemo(() => {
    const map = new Map(questions.map((q) => [q.id, q]));
    return errorIds.map((id) => map.get(id)).filter(Boolean) as QuizQuestion[];
  }, [errorIds, questions]);

  if (!list.length) {
    return (
      <div class="card-surface p-6 sm:p-8">
        <h2 class="heading-card">Sin errores guardados aún</h2>
        <p class="text-body mt-3">
          Aquí aparecerán las preguntas que respondas incorrectamente. Completa un simulacro o una
          práctica; tus fallos se guardan solo en este dispositivo.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a href="/simulacro/a-i" class="btn-primary">
            Empezar simulacro
          </a>
          <a href="/practica/senales" class="btn-secondary">
            Practicar por tema
          </a>
        </div>
      </div>
    );
  }

  const current = list[index];
  const progress = loadProgress();
  const saved = progress.errores.find((e) => e.preguntaId === current.id);

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-support">
          Error {index + 1} de {list.length}
        </p>
        <button
          type="button"
          class="btn-text text-error"
          onClick={() => {
            if (window.confirm('¿Borrar la lista de errores guardados en este dispositivo?')) {
              clearErrores();
              setErrorIds([]);
            }
          }}
        >
          Borrar lista de errores
        </button>
      </div>

      <QuestionCard
        question={current}
        index={index}
        total={list.length}
        selected={saved?.seleccion ?? null}
        showFeedback
        showExplicacion
        disabled
        feedbackMessage="Esta respuesta no es correcta. Veamos por qué."
        onSelect={() => {}}
      />

      <div class="flex gap-3">
        <button
          type="button"
          class="btn-secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          Anterior
        </button>
        <button
          type="button"
          class="btn-primary"
          disabled={index >= list.length - 1}
          onClick={() => setIndex((i) => i + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
