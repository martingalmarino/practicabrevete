import { useState } from 'preact/hooks';
import type { QuizQuestion } from './types';

interface Props {
  question: QuizQuestion;
  /** Vista más baja para secciones editoriales */
  compact?: boolean;
}

/**
 * Vista previa interactiva del producto.
 * No guarda progreso ni afecta resultados reales.
 */
export default function PreviewPractice({ question, compact = false }: Props) {
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
    <div
      class={`rounded-[16px] border border-border bg-surface shadow-[var(--shadow-soft)] ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm font-bold text-ink">Así puedes practicar</p>
        <p class="text-xs text-ink-muted sm:text-sm">Vista previa · no guarda progreso</p>
      </div>

      <h3
        class={`font-bold leading-snug text-ink ${
          compact ? 'mt-3 text-[1rem]' : 'mt-4 text-[1.125rem] sm:text-[1.25rem]'
        }`}
      >
        {question.enunciado}
      </h3>

      {question.imagen?.src && (
        <figure class={`flex justify-center ${compact ? 'mt-2.5' : 'mt-4'}`}>
          <img
            src={question.imagen.src}
            alt={question.imagen.alt}
            class={`h-auto w-auto ${compact ? 'max-h-16' : 'max-h-28'}`}
            width={compact ? 64 : 112}
            height={compact ? 64 : 112}
            loading="lazy"
          />
        </figure>
      )}

      <fieldset class={`${compact ? 'mt-3 space-y-1.5' : 'mt-5 space-y-2'}`} disabled={confirmed}>
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
              class={`flex cursor-pointer items-start gap-2.5 rounded-[12px] border px-3 transition-colors ${
                compact ? 'min-h-10 py-2' : 'min-h-12 py-3 gap-3'
              } ${state} ${confirmed ? 'cursor-default' : ''}`}
            >
              <input
                type="radio"
                name={`preview-${question.id}`}
                class="mt-0.5"
                checked={isSelected}
                onChange={() => setSelected(i)}
                disabled={confirmed}
              />
              <span class={`leading-snug text-ink ${compact ? 'text-[13px]' : 'text-[15px] sm:text-base'}`}>
                <span class="mr-1 font-semibold">{letters[i]}.</span>
                <span class={compact && !confirmed ? 'line-clamp-2' : undefined}>{opcion}</span>
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
          class={`btn-primary w-full sm:w-auto ${compact ? 'mt-3 !min-h-11 text-sm' : 'mt-4'}`}
          onClick={confirm}
          disabled={selected === null}
        >
          Confirmar respuesta
        </button>
      ) : (
        <div class={`space-y-3 ${compact ? 'mt-3' : 'mt-4'}`}>
          <p class={`text-sm font-semibold ${isCorrect ? 'text-success' : 'text-error'}`}>
            {isCorrect
              ? 'Respuesta correcta'
              : 'Esta respuesta no es correcta. Veamos por qué.'}
          </p>
          {question.explicacion?.texto && (
            <div class="rounded-[12px] border border-border bg-soft p-3 text-sm text-ink-muted">
              <p class="font-semibold text-ink">Explicación</p>
              <p class={`mt-1.5 leading-relaxed ${compact ? 'line-clamp-4' : ''}`}>
                {question.explicacion.texto}
              </p>
            </div>
          )}
          <button type="button" class="btn-secondary !min-h-11 text-sm" onClick={reset}>
            Probar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
