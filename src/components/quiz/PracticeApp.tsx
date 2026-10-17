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
  const [order, setOrder] = useState(() => [...questions].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [stats, setStats] = useState(() => loadProgress().practicaPorTema[tema] ?? { vistas: 0, aciertos: 0 });

  useEffect(() => {
    trackInicioSimulacro('a-i', 'practica');
  }, []);

  const current = order[index];
  const answered = selected !== null;

  const accuracy = useMemo(() => {
    if (!stats.vistas) return 0;
    return Math.round((stats.aciertos / stats.vistas) * 100);
  }, [stats]);

  if (!questions.length) {
    return (
      <div class="rounded-xl border border-line bg-surface-elevated p-6">
        <p class="text-ink-muted">Aún no hay preguntas clasificadas en este tema.</p>
        <a href="/practica/senales" class="btn-primary mt-4 inline-flex">
          Ir a señales
        </a>
      </div>
    );
  }

  function onSelect(i: number) {
    if (answered || !current) return;
    setSelected(i);
    setShowExp(true);
    const acierto = i === current.correcta;
    const state = recordPracticeAnswer({
      tema,
      acierto,
      respuesta: {
        preguntaId: current.id,
        seleccion: i,
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
    setShowExp(false);
    if (index >= order.length - 1) {
      setOrder([...questions].sort(() => Math.random() - 0.5));
      setIndex(0);
    } else {
      setIndex((n) => n + 1);
    }
  }

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-muted">
        <p>
          Tema: <span class="font-semibold text-ink">{temaNombre}</span>
        </p>
        <p>
          Progreso local: {stats.aciertos}/{stats.vistas} ({accuracy}% acierto)
        </p>
      </div>

      <QuestionCard
        question={current}
        index={index}
        total={order.length}
        selected={selected}
        showFeedback={answered}
        showExplicacion={showExp}
        disabled={answered}
        onSelect={onSelect}
        onToggleExplicacion={() => {
          setShowExp((v) => !v);
          trackClickExplicacion(current.id);
        }}
      />

      {answered && (
        <div class="flex flex-wrap items-center gap-3">
          <p class={`font-semibold ${selected === current.correcta ? 'text-success' : 'text-danger'}`}>
            {selected === current.correcta ? 'Correcto' : 'Incorrecto'}
          </p>
          <button type="button" class="btn-primary" onClick={next}>
            Siguiente pregunta
          </button>
        </div>
      )}
    </div>
  );
}
