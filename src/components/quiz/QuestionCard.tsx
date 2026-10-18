import type { QuizQuestion } from './types';

interface Props {
  question: QuizQuestion;
  index: number;
  total: number;
  selected: number | null;
  showFeedback: boolean;
  onSelect: (optionIndex: number) => void;
  onToggleExplicacion?: () => void;
  showExplicacion?: boolean;
  disabled?: boolean;
  /** En práctica: muestra mensaje de estado sobre la selección */
  feedbackMessage?: string | null;
}

export function QuestionCard({
  question,
  index,
  total,
  selected,
  showFeedback,
  onSelect,
  onToggleExplicacion,
  showExplicacion,
  disabled,
  feedbackMessage,
}: Props) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <article class="card-surface p-4 sm:p-6" aria-labelledby={`q-${question.id}`}>
      <p class="text-support font-medium" aria-live="polite">
        Pregunta {index + 1} de {total}
      </p>
      <h2
        id={`q-${question.id}`}
        class="mt-3 text-[1.3125rem] font-semibold leading-snug text-ink sm:text-2xl"
      >
        {question.enunciado}
      </h2>

      {question.imagen?.src && (
        <figure class="mt-5 flex justify-center">
          <a
            href={question.imagen.src}
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-[12px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label={`Ampliar imagen: ${question.imagen.alt}`}
          >
            <img
              src={question.imagen.src}
              alt={question.imagen.alt}
              class="h-auto max-h-48 w-full max-w-md object-contain"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </a>
          <figcaption class="sr-only">{question.imagen.alt}. Enlace para ampliar.</figcaption>
        </figure>
      )}

      <fieldset class="mt-6 space-y-2.5" disabled={disabled && showFeedback}>
        <legend class="sr-only">Opciones de respuesta</legend>
        {question.opciones.map((opcion, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correcta;
          let state = 'border-border bg-surface hover:border-brand';
          if (showFeedback) {
            if (isCorrect) state = 'border-success bg-success-soft';
            else if (isSelected && !isCorrect) state = 'border-error bg-error-soft';
            else state = 'border-border bg-surface opacity-80';
          } else if (isSelected) {
            state = 'border-brand bg-brand-soft';
          }

          return (
            <label
              key={i}
              class={`flex min-h-12 cursor-pointer items-start gap-3 rounded-[12px] border px-3.5 py-3.5 transition-colors ${state} ${disabled && showFeedback ? 'cursor-default' : ''}`}
            >
              <span
                class={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  isSelected && !showFeedback
                    ? 'border-brand bg-brand text-white'
                    : showFeedback && isCorrect
                      ? 'border-success bg-success text-white'
                      : showFeedback && isSelected
                        ? 'border-error bg-error text-white'
                        : 'border-border text-ink-muted'
                }`}
                aria-hidden="true"
              >
                {letters[i]}
              </span>
              <input
                type="radio"
                name={`pregunta-${question.id}`}
                class="sr-only"
                checked={isSelected}
                onChange={() => onSelect(i)}
                disabled={disabled && showFeedback}
              />
              <span class="text-[15px] leading-snug text-ink sm:text-base">
                {opcion}
                {showFeedback && isCorrect && (
                  <span class="mt-1 block text-sm font-medium text-success">Opción correcta</span>
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <span class="mt-1 block text-sm font-medium text-error">Tu selección</span>
                )}
              </span>
            </label>
          );
        })}
      </fieldset>

      {feedbackMessage && (
        <p
          class={`mt-4 text-sm font-semibold ${selected === question.correcta ? 'text-success' : 'text-error'}`}
          role="status"
        >
          {feedbackMessage}
        </p>
      )}

      {showFeedback &&
        question.explicacion?.texto &&
        question.explicacion.texto.length > 0 &&
        !question.explicacion.texto.startsWith('TODO') &&
        question.explicacion.status === 'revisada' && (
          <div class="mt-4">
            {onToggleExplicacion && (
              <button type="button" class="btn-secondary !min-h-11 text-sm" onClick={onToggleExplicacion}>
                {showExplicacion ? 'Ocultar explicación' : 'Ver explicación'}
              </button>
            )}
            {(showExplicacion || !onToggleExplicacion) && (
              <div class="mt-3 rounded-[12px] border border-border bg-bg p-4 text-sm text-ink-muted">
                <p class="font-semibold text-ink">Explicación</p>
                <p class="mt-2 leading-relaxed">{question.explicacion.texto}</p>
                {question.explicacion.baseLegal &&
                  question.explicacion.baseLegal.length > 0 &&
                  !question.explicacion.baseLegal.startsWith('TODO') && (
                    <p class="mt-3 text-xs text-ink-muted">
                      <span class="font-medium text-ink">Referencia:</span> {question.explicacion.baseLegal}
                    </p>
                  )}
              </div>
            )}
          </div>
        )}
    </article>
  );
}
