import { useEffect, useMemo, useState } from 'preact/hooks';
import type { QuizQuestion } from './types';
import { QuestionCard } from './QuestionCard';
import { recordPracticeAnswer, loadProgress } from '../../lib/progress';
import { trackClickExplicacion, trackInicioSimulacro } from '../../lib/analytics';
import type { TemaId } from '../../data/tipos';

interface Props {
  questions: QuizQuestion[];
  tema: TemaId;
  temaNombre: string;
}

export default function PracticeApp({ questions, tema, temaNombre }: Props) {
  const [order, setOrder] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showExp, setShowExp] = useState(true);
  const [stats, setStats] = useState(
    () => loadProgress().practicaPorTema[tema] ?? { vistas: 0, aciertos: 0 },
  );

  useEffect(() => {
    function shuffle<T>(array: T[]): T[] {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }
    setOrder(shuffle(questions));
    trackInicioSimulacro('a-i', 'practica');
  }, [questions]);

  const current = order[index];
  
  if (!order.length) {
    return <div class="card-surface p-6"><p class="text-body">Cargando...</p></div>;
  }
  const accuracy = useMemo(() => {
    if (!stats.vistas) return 0;
    return Math.round((stats.aciertos / stats.vistas) * 100);
  }, [stats]);

  if (!questions.length) {
    return (
      <div class="card-surface p-6">
        <p class="text-body">Aún no hay preguntas clasificadas en este tema.</p>
        <a href="/practica/senales" class="btn-primary mt-4 inline-flex">
          Ir a señales
        </a>
      </div>
    );
  }

  function onSelect(i: number) {
    if (confirmed) return;
    setSelected(i);
  }

  function confirm() {
    if (selected === null || !current || confirmed) return;
    setConfirmed(true);
    setShowExp(true);
    const acierto = selected === current.correcta;
    const state = recordPracticeAnswer({
      tema,
      acierto,
      respuesta: {
        preguntaId: current.id,
        seleccion: selected,
        correcta: current.correcta,
        acierto,
        tema,
        categoria: current.categoria,
        at: new Date().toISOString(),
      },
    });
    setStats(state.practicaPorTema[tema] ?? { vistas: 0, aciertos: 0 });
    trackClickExplicacion(current.id);
  }

  function next() {
    setSelected(null);
    setConfirmed(false);
    setShowExp(true);
    if (index >= order.length - 1) {
      function shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      }
      setOrder(shuffle(questions));
      setIndex(0);
    } else {
      setIndex((n) => n + 1);
    }
  }

  const feedbackMessage = confirmed
    ? selected === current.correcta
      ? 'Respuesta correcta'
      : 'Esta respuesta no es correcta. Veamos por qué.'
    : null;

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-sm font-semibold text-ink">Práctica · {temaNombre}</p>
          <p class="text-support">
            Feedback después de confirmar · progreso en este dispositivo
          </p>
        </div>
        <p class="text-support" aria-live="polite">
          {stats.vistas > 0
            ? `${stats.aciertos}/${stats.vistas} aciertos (${accuracy}%)`
            : 'Tu progreso aparecerá después de tu primera práctica.'}
        </p>
      </div>

      <div
        class="h-2 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={order.length}
        aria-label="Progreso de la práctica"
      >
        <div
          class="h-full bg-brand"
          style={{ width: `${((index + 1) / order.length) * 100}%` }}
        />
      </div>

      <QuestionCard
        question={current}
        index={index}
        total={order.length}
        selected={selected}
        showFeedback={confirmed}
        showExplicacion={showExp}
        disabled={confirmed}
        feedbackMessage={feedbackMessage}
        onSelect={onSelect}
        onToggleExplicacion={() => {
          setShowExp((v) => !v);
          trackClickExplicacion(current.id);
        }}
      />

      <div class="flex flex-wrap items-center gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {!confirmed ? (
          <>
            <button
              type="button"
              class="btn-primary"
              onClick={confirm}
              disabled={selected === null}
            >
              Confirmar respuesta
            </button>
            {selected === null && (
              <p class="text-support" role="status">
                Elige una respuesta para continuar.
              </p>
            )}
          </>
        ) : (
          <button type="button" class="btn-primary" onClick={next}>
            Siguiente pregunta
          </button>
        )}
      </div>
    </div>
  );
}
