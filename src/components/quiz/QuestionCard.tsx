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
}: Props) {
  return (
    <article class="rounded-xl border border-line bg-surface-elevated p-4 sm:p-6" aria-labelledby={`q-${question.id}`}>
      <p class="text-sm font-medium text-ink-muted">
        Pregunta {index + 1} de {total}
      </p>
      <h2 id={`q-${question.id}`} class="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">
        {question.enunciado}
      </h2>

      {question.imagen?.src && (
        <figure class="mt-4 flex justify-center">
          <img
            src={question.imagen.src}
            alt={question.imagen.alt}
            class="h-auto max-h-40 w-auto"
            width="120"
            height="120"
            loading="lazy"
          />
        </figure>
      )}

      <fieldset class="mt-5 space-y-2" disabled={disabled}>
        <legend class="sr-only">Opciones de respuesta</legend>
        {question.opciones.map((opcion, i) => {
          const letter = 'ABCD'[i];
          const isSelected = selected === i;
          const isCorrect = i === question.correcta;
          let stateClass = 'border-line hover:border-brand';
          if (showFeedback) {
            if (isCorrect) stateClass = 'border-success bg-success/10';
            else if (isSelected && !isCorrect) stateClass = 'border-danger bg-danger/10';
          } else if (isSelected) {
            stateClass = 'border-brand bg-brand/5';
          }

          return (
            <label
              key={i}
              class={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition ${stateClass} ${disabled ? 'cursor-default' : ''}`}
            >
              <input
                type="radio"
                name={`pregunta-${question.id}`}
                class="mt-1"
                checked={isSelected}
                onChange={() => onSelect(i)}
                disabled={disabled}
              />
              <span class="text-sm sm:text-base">
                <span class="mr-2 font-semibold text-ink">{letter}.</span>
                {opcion}
              </span>
            </label>
          );
        })}
      </fieldset>

      {showFeedback && question.explicacion?.texto && (
        <div class="mt-4">
          {onToggleExplicacion && (
            <button type="button" class="btn-secondary !py-2 text-sm" onClick={onToggleExplicacion}>
              {showExplicacion ? 'Ocultar explicación' : 'Ver explicación'}
            </button>
          )}
          {(showExplicacion || !onToggleExplicacion) && (
            <div class="mt-3 rounded-lg border border-line bg-surface p-4 text-sm text-ink-muted">
              <p class="font-semibold text-ink">Explicación</p>
              <p class="mt-2 leading-relaxed">{question.explicacion.texto}</p>
              <p class="mt-2 text-xs">
                Base legal: {question.explicacion.baseLegal}
                {question.explicacion.status === 'revisar' && (
                  <span class="ml-2 rounded bg-accent/20 px-1.5 py-0.5 text-ink">borrador — revisar</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
