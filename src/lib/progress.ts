import type { TemaId } from '../data/tipos';

const STORAGE_KEY = 'practicabrevete.progress.v1';

export interface RespuestaGuardada {
  preguntaId: string;
  seleccion: number;
  correcta: number;
  acierto: boolean;
  tema: TemaId;
  categoria: string;
  at: string;
}

export interface ProgressState {
  errores: RespuestaGuardada[];
  historial: Array<{
    categoria: string;
    puntaje: number;
    total: number;
    aprobado: boolean;
    at: string;
  }>;
  practicaPorTema: Partial<Record<TemaId, { vistas: number; aciertos: number }>>;
}

const empty = (): ProgressState => ({
  errores: [],
  historial: [],
  practicaPorTema: {},
});

export function loadProgress(): ProgressState {
  if (typeof localStorage === 'undefined') return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) } as ProgressState;
  } catch {
    return empty();
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function recordExamResult(opts: {
  categoria: string;
  puntaje: number;
  total: number;
  aprobado: boolean;
  respuestas: RespuestaGuardada[];
}) {
  const state = loadProgress();
  state.historial = [
    {
      categoria: opts.categoria,
      puntaje: opts.puntaje,
      total: opts.total,
      aprobado: opts.aprobado,
      at: new Date().toISOString(),
    },
    ...state.historial,
  ].slice(0, 30);

  const nuevosErrores = opts.respuestas.filter((r) => !r.acierto);
  const idsNuevos = new Set(nuevosErrores.map((e) => e.preguntaId));
  state.errores = [
    ...nuevosErrores,
    ...state.errores.filter((e) => !idsNuevos.has(e.preguntaId)),
  ].slice(0, 100);

  saveProgress(state);
  return state;
}

export function recordPracticeAnswer(opts: {
  tema: TemaId;
  acierto: boolean;
  respuesta: RespuestaGuardada;
}) {
  const state = loadProgress();
  const prev = state.practicaPorTema[opts.tema] ?? { vistas: 0, aciertos: 0 };
  state.practicaPorTema[opts.tema] = {
    vistas: prev.vistas + 1,
    aciertos: prev.aciertos + (opts.acierto ? 1 : 0),
  };
  if (!opts.acierto) {
    state.errores = [opts.respuesta, ...state.errores.filter((e) => e.preguntaId !== opts.respuesta.preguntaId)].slice(
      0,
      100,
    );
  } else {
    state.errores = state.errores.filter((e) => e.preguntaId !== opts.respuesta.preguntaId);
  }
  saveProgress(state);
  return state;
}

export function clearErrores() {
  const state = loadProgress();
  state.errores = [];
  saveProgress(state);
}
