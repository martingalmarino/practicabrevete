import { useState } from 'preact/hooks';
import type { QuizQuestion } from './types';

interface Props {
  question: QuizQuestion;
}

/**
 * Vista previa interactiva del producto.
 * No guarda progreso ni afecta resultados reales.
 */
export default function PreviewPractice({ question }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const letters = ['A', 'B', 'C', 'D'];
  const isCorrect = confirmed && selected === question.correcta;

  function confirm() {
    if (selected === null) return;
    setConfirmed(true);
  }

  function reset() {
    setSelected(null);
    setConfirmed(false);
  }

  return (
    <div class="rounded-[16px] border border-border bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm font-bold text-ink">Así puedes practicar</p>
        <p class="text-support">Vista previa · no guarda progreso</p>
      </div>

      <h3 class="mt-4 text-[1.125rem] font-bold leading-snug text-ink sm:text-[1.25rem]">
        {question.enunciado}
      </h3>

      {question.imagen?.src && (
        <figure class="mt-4 flex justify-center">
          <img
            src={question.imagen.src}
            alt={question.imagen.alt}
            class="h-auto max-h-28 w-auto"
            width="112"
            height="112"
            loading="lazy"
          />
        </figure>
      )}

      <fieldset class="mt-5 space-y-2" disabled={confirmed}>
        <legend class="sr-only">Opciones de la vista previa</legend>
        {question.opciones.map((opcion, i) => {
          const isSelected = selected === i;
          const showCorrect = confirmed && i === question.correcta;
          const showWrong = confirmed && isSelected && i !== question.correcta;
          let state =
            'border-border bg-surface hover:border-brand focus-within:border-brand';
          if (showCorrect) state = 'border-success bg-success-soft';
          else if (showWrong) state = 'border-error bg-error-soft';
          else if (isSelected) state = 'border-brand bg-brand-soft';

          return (
            <label
              key={i}
              class={`flex min-h-12 cursor-pointer items-start gap-3 rounded-[12px] border px-3 py-3 transition-colors ${state} ${confirmed ? 'cursor-default' : ''}`}
            >
              <input
                type="radio"
                name={`preview-${question.id}`}
                class="mt-1"
                checked={isSelected}
                onChange={() => setSelected(i)}
                disabled={confirmed}
              />
              <span class="text-[15px] leading-snug text-ink sm:text-base">
                <span class="mr-1.5 font-semibold">{letters[i]}.</span>
                {opcion}
                {showCorrect && (
                  <span class="mt-1 block text-sm font-medium text-success">Respuesta correcta</span>
                )}
                {showWrong && (
                  <span class="mt-1 block text-sm font-medium text-error">Esta respuesta no es correcta</span>
                )}
              </span>
            </label>
          );
        })}
      </fieldset>

      {!confirmed ? (
        <button
          type="button"
          class="btn-primary mt-4 w-full sm:w-auto"
          onClick={confirm}
          disabled={selected === null}
        >
          Confirmar respuesta
        </button>
      ) : (
        <div class="mt-4 space-y-3">
          <p class={`text-sm font-semibold ${isCorrect ? 'text-success' : 'text-error'}`}>
            {isCorrect
              ? 'Respuesta correcta'
              : 'Esta respuesta no es correcta. Veamos por qué.'}
          </p>
          {question.explicacion?.texto && (
            <div class="rounded-[12px] border border-border bg-soft p-4 text-sm text-ink-muted">
              <p class="font-semibold text-ink">Explicación</p>
              <p class="mt-2 leading-relaxed">{question.explicacion.texto}</p>
            </div>
          )}
          <button type="button" class="btn-secondary" onClick={reset}>
            Probar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
