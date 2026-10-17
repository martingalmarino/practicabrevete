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
  const [reviewIndex, setReviewIndex] = useState(0);

  const current = examQs[index];
  const total = examQs.length;

  const score = useMemo(
    () => examQs.reduce((acc, q) => acc + (answers[q.id] === q.correcta ? 1 : 0), 0),
    [examQs, answers],
  );

  const aprobado = score >= passScore;

  const errores = useMemo(
    () => examQs.filter((q) => answers[q.id] !== undefined && answers[q.id] !== q.correcta),
    [examQs, answers],
  );

  const topicBreakdown = useMemo(() => {
    const map = new Map<string, { ok: number; total: number }>();
    for (const q of examQs) {
      const prev = map.get(q.tema) ?? { ok: 0, total: 0 };
      prev.total += 1;
      if (answers[q.id] === q.correcta) prev.ok += 1;
      map.set(q.tema, prev);
    }
    return [...map.entries()];
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

  function requestExit() {
    if (
      window.confirm(
        'Si sales ahora, perderás el avance de este simulacro. ¿Quieres salir de todos modos?',
      )
    ) {
      setPhase('setup');
      setAnswers({});
      setExamQs([]);
    }
  }

  function selectOption(optionIndex: number) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  }

  function next() {
    if (answers[current?.id ?? ''] === undefined) return;
    if (index >= total - 1) finishExam(examQs, answers);
    else setIndex((i) => i + 1);
  }

  function prev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  if (questions.length === 0) {
    return (
      <div class="card-surface p-6">
        <p class="text-body">
          El banco de esta categoría aún no está cargado. Mientras tanto puedes practicar la categoría A-I.
        </p>
        <a href="/simulacro/a-i" class="btn-primary mt-4 inline-flex">
          Ir al simulacro A-I
        </a>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <div class="card-surface p-6 sm:p-8">
        <p class="badge">Modo simulacro · {categoria}</p>
        <h2 class="heading-card mt-4 text-2xl">Antes de empezar</h2>
        <ul class="text-body mt-4 list-disc space-y-2 pl-5">
          <li>
            {Math.min(40, questions.length)} preguntas al azar del banco de estudio.
          </li>
          <li>
            Referencia de aprobación: {passScore} o más correctas (según la orientación publicada del
            examen de reglas).
          </li>
          <li>
            Durante el simulacro no verás si cada respuesta es correcta; el detalle llega al final.
          </li>
          <li>
            El temporizador es opcional y sirve para practicar el ritmo. No es una copia exacta del
            examen oficial.
          </li>
        </ul>
        <label class="mt-6 flex min-h-11 items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            class="h-4 w-4"
            checked={useTimer}
            onChange={(e) => setUseTimer((e.target as HTMLInputElement).checked)}
          />
          Usar temporizador de {timeLimitMinutes} minutos
        </label>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" class="btn-primary" onClick={start}>
            Empezar simulacro
          </button>
          <a href="/practica/senales" class="btn-secondary">
            Prefiero practicar por tema
          </a>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div class="space-y-6">
        <div class="card-surface p-6 sm:p-8">
          <p class="badge">Resultado del simulacro</p>
          <h2 class="mt-3 text-3xl font-bold text-ink">
            {aprobado ? 'Alcanzaste el umbral de práctica' : 'Aún no alcanzas el umbral'}
          </h2>
          <p class="text-body mt-3">
            {score} de {total} correctas
            {aprobado
              ? ` (referencia: ${passScore} o más).`
              : ` · necesitas ${passScore} para el umbral de práctica.`}
          </p>
          <p class="text-support mt-2">
            Este resultado es una herramienta de estudio. No garantiza el resultado del examen oficial.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            {errores.length > 0 ? (
              <button
                type="button"
                class="btn-primary"
                onClick={() => {
                  setReviewIndex(0);
                  setPhase('review');
                  trackRepasoErrores(errores.length);
                }}
              >
                Repasar mis errores ({errores.length})
              </button>
            ) : (
              <a href="/practica/senales" class="btn-primary">
                Seguir practicando por tema
              </a>
            )}
            <button type="button" class="btn-secondary" onClick={start}>
              Volver a practicar
            </button>
          </div>
        </div>

        {topicBreakdown.length > 0 && (
          <div class="card-surface p-5">
            <h3 class="font-semibold text-ink">Desempeño por tema</h3>
            <ul class="mt-3 space-y-2 text-sm">
              {topicBreakdown.map(([tema, stats]) => (
                <li key={tema} class="flex justify-between gap-4 border-b border-border py-2 last:border-0">
                  <span class="text-ink-muted capitalize">{tema.replace(/-/g, ' ')}</span>
                  <span class="font-medium text-ink">
                    {stats.ok}/{stats.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div class="card-surface p-5">
          <h3 class="font-semibold text-ink">Detalle por pregunta</h3>
          <ol class="mt-3 space-y-2 text-sm">
            {examQs.map((q, i) => {
              const ok = answers[q.id] === q.correcta;
              return (
                <li key={q.id} class="flex gap-2 border-b border-border py-2 last:border-0">
                  <span class={ok ? 'font-semibold text-success' : 'font-semibold text-error'} aria-hidden="true">
                    {ok ? '✓' : '✗'}
                  </span>
                  <span class="text-ink-muted">
                    <span class="sr-only">{ok ? 'Correcta' : 'Incorrecta'}. </span>
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
        <div class="card-surface p-6">
          <p class="text-body">No hay errores para repasar en este intento.</p>
          <button type="button" class="btn-primary mt-4" onClick={() => setPhase('result')}>
            Volver al resultado
          </button>
        </div>
      );
    }
    return (
      <div class="space-y-4">
        <p class="text-support">
          Repaso de errores {reviewIndex + 1} de {errores.length}
        </p>
        <QuestionCard
          question={q}
          index={reviewIndex}
          total={errores.length}
          selected={answers[q.id] ?? null}
          showFeedback
          showExplicacion
          disabled
          feedbackMessage={
            answers[q.id] === q.correcta
              ? 'Respuesta correcta'
              : 'Esta respuesta no es correcta. Veamos por qué.'
          }
          onSelect={() => {}}
          onToggleExplicacion={() => trackClickExplicacion(q.id)}
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

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-ink">Simulacro {categoria}</p>
          <p class="text-support" aria-live="polite">
            Pregunta {index + 1} de {total}
            {useTimer ? ` · ${mm}:${ss}` : ''}
          </p>
        </div>
        <button type="button" class="btn-text" onClick={requestExit}>
          Salir
        </button>
      </div>

      <div
        class="h-2 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Progreso del simulacro"
      >
        <div
          class="h-full bg-brand transition-[width] duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
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

      {answers[current?.id ?? ''] === undefined && (
        <p class="text-support" role="status">
          Elige una respuesta para continuar.
        </p>
      )}

      <div class="flex flex-wrap justify-between gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button type="button" class="btn-secondary" onClick={prev} disabled={index === 0}>
          Anterior
        </button>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="btn-secondary"
            onClick={() => {
              if (window.confirm('¿Finalizar el simulacro con las respuestas marcadas hasta ahora?')) {
                finishExam(examQs, answers);
              }
            }}
          >
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
