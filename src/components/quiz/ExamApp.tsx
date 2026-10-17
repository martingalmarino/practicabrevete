import { useEffect, useMemo, useState } from 'preact/hooks';
import type { QuizQuestion } from './types';
import { QuestionCard } from './QuestionCard';
import { recordExamResult, type RespuestaGuardada } from '../../lib/progress';
import {
  trackClickExplicacion,
  trackFinSimulacro,
  trackInicioSimulacro,
  trackRepasoErrores,
} from '../../lib/analytics';

interface Props {
  questions: QuizQuestion[];
  categoria: string;
  passScore: number;
  timeLimitMinutes: number;
}

type Phase = 'setup' | 'exam' | 'result' | 'review';

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ExamApp({ questions, categoria, passScore, timeLimitMinutes }: Props) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [useTimer, setUseTimer] = useState(true);
  const [examQs, setExamQs] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [showExp, setShowExp] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const current = examQs[index];
  const total = examQs.length;

  const score = useMemo(() => {
    return examQs.reduce((acc, q) => acc + (answers[q.id] === q.correcta ? 1 : 0), 0);
  }, [examQs, answers]);

  const aprobado = score >= passScore;

  const errores = useMemo(() => {
    return examQs.filter((q) => answers[q.id] !== undefined && answers[q.id] !== q.correcta);
  }, [examQs, answers]);

  function finishExam(qs: QuizQuestion[], ans: Record<string, number>) {
    const respuestas: RespuestaGuardada[] = qs.map((q) => {
      const seleccion = ans[q.id] ?? -1;
      return {
        preguntaId: q.id,
        seleccion,
        correcta: q.correcta,
        acierto: seleccion === q.correcta,
        tema: q.tema as RespuestaGuardada['tema'],
        categoria,
        at: new Date().toISOString(),
      };
    });
    const puntaje = respuestas.filter((r) => r.acierto).length;
    recordExamResult({
      categoria,
      puntaje,
      total: qs.length,
      aprobado: puntaje >= passScore,
      respuestas,
    });
    trackFinSimulacro({
      categoria,
      aprobado: puntaje >= passScore,
      puntaje,
      total: qs.length,
    });
    setPhase('result');
  }

  useEffect(() => {
    if (phase !== 'exam' || !useTimer) return;
    if (secondsLeft <= 0) {
      finishExam(examQs, answers);
      return;
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, useTimer, secondsLeft]);

  function start() {
    const picked = shuffle(questions).slice(0, Math.min(40, questions.length));
    setExamQs(picked);
    setAnswers({});
    setIndex(0);
    setSecondsLeft(timeLimitMinutes * 60);
    setPhase('exam');
    trackInicioSimulacro(categoria, 'examen');
  }

  function finish() {
    finishExam(examQs, answers);
  }

  function selectOption(optionIndex: number) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  }

  function next() {
    if (index >= total - 1) finish();
    else {
      setIndex((i) => i + 1);
      setShowExp(false);
    }
  }

  function prev() {
    if (index > 0) {
      setIndex((i) => i - 1);
      setShowExp(false);
    }
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  if (questions.length === 0) {
    return (
      <div class="rounded-xl border border-line bg-surface-elevated p-6">
        <p class="text-ink-muted">
          El banco de esta categoría aún no está cargado. Mientras tanto practica la categoría A-I.
        </p>
        <a href="/simulacro/a-i" class="btn-primary mt-4 inline-flex">
          Ir al simulacro A-I
        </a>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <div class="rounded-xl border border-line bg-surface-elevated p-6">
        <h2 class="font-display text-2xl font-semibold text-ink">Configura tu simulacro</h2>
        <ul class="mt-4 list-disc space-y-1 pl-5 text-ink-muted">
          <li>{Math.min(40, questions.length)} preguntas al azar del banco</li>
          <li>
            Apruebas con {passScore} o más correctas (regla vigente del examen de reglas)
          </li>
          <li>Temporizador opcional de {timeLimitMinutes} minutos</li>
        </ul>
        <label class="mt-6 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={useTimer} onChange={(e) => setUseTimer((e.target as HTMLInputElement).checked)} />
          Usar temporizador de {timeLimitMinutes} minutos
        </label>
        <button type="button" class="btn-primary mt-6" onClick={start}>
          Empezar simulacro
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div class="space-y-6">
        <div class="rounded-xl border border-line bg-surface-elevated p-6">
          <p class="text-sm font-semibold uppercase tracking-wide text-brand">Resultado</p>
          <h2 class="mt-2 font-display text-3xl font-bold text-ink">
            {aprobado ? 'Aprobado' : 'Desaprobado'}
          </h2>
          <p class="mt-2 text-lg text-ink-muted">
            {score} de {total} correctas (necesitas {passScore})
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <button type="button" class="btn-primary" onClick={start}>
              Nuevo intento
            </button>
            {errores.length > 0 && (
              <button
                type="button"
                class="btn-secondary"
                onClick={() => {
                  setReviewIndex(0);
                  setPhase('review');
                  trackRepasoErrores(errores.length);
                }}
              >
                Repasar errores ({errores.length})
              </button>
            )}
            <a href={`/practica/${errores[0]?.tema || 'senales'}`} class="btn-secondary">
              Practicar por tema
            </a>
          </div>
        </div>

        <div class="rounded-xl border border-line bg-surface-elevated p-4">
          <h3 class="font-semibold text-ink">Detalle por pregunta</h3>
          <ol class="mt-3 space-y-2 text-sm">
            {examQs.map((q, i) => {
              const ok = answers[q.id] === q.correcta;
              return (
                <li key={q.id} class="flex gap-2 border-b border-line/60 py-2">
                  <span class={ok ? 'text-success' : 'text-danger'}>{ok ? '✓' : '✗'}</span>
                  <span class="text-ink-muted">
                    {i + 1}. {q.enunciado.slice(0, 90)}
                    {q.enunciado.length > 90 ? '…' : ''}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }

  if (phase === 'review') {
    const q = errores[reviewIndex];
    if (!q) {
      return (
        <div class="rounded-xl border border-line p-6">
          <p>No hay errores para repasar.</p>
          <button type="button" class="btn-primary mt-4" onClick={() => setPhase('result')}>
            Volver al resultado
          </button>
        </div>
      );
    }
    return (
      <div class="space-y-4">
        <p class="text-sm text-ink-muted">
          Repaso de errores {reviewIndex + 1} / {errores.length}
        </p>
        <QuestionCard
          question={q}
          index={reviewIndex}
          total={errores.length}
          selected={answers[q.id] ?? null}
          showFeedback
          showExplicacion
          disabled
          onSelect={() => {}}
          onToggleExplicacion={() => {
            trackClickExplicacion(q.id);
          }}
        />
        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="btn-secondary"
            disabled={reviewIndex === 0}
            onClick={() => setReviewIndex((i) => i - 1)}
          >
            Anterior
          </button>
          <button
            type="button"
            class="btn-primary"
            onClick={() => {
              if (reviewIndex >= errores.length - 1) setPhase('result');
              else setReviewIndex((i) => i + 1);
            }}
          >
            {reviewIndex >= errores.length - 1 ? 'Terminar repaso' : 'Siguiente error'}
          </button>
        </div>
      </div>
    );
  }

  // exam phase
  return (
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div
          class="h-2 flex-1 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label="Progreso del simulacro"
        >
          <div
            class="h-full bg-brand transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        {useTimer && (
          <p class="font-mono font-semibold text-ink" aria-live="polite">
            {mm}:{ss}
          </p>
        )}
      </div>

      {current && (
        <QuestionCard
          question={current}
          index={index}
          total={total}
          selected={answers[current.id] ?? null}
          showFeedback={false}
          onSelect={selectOption}
        />
      )}

      <div class="flex flex-wrap justify-between gap-3">
        <button type="button" class="btn-secondary" onClick={prev} disabled={index === 0}>
          Anterior
        </button>
        <div class="flex gap-2">
          <button type="button" class="btn-secondary" onClick={finish}>
            Finalizar
          </button>
          <button
            type="button"
            class="btn-primary"
            onClick={next}
            disabled={answers[current?.id ?? ''] === undefined}
          >
            {index >= total - 1 ? 'Ver resultado' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
