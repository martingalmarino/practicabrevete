type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

export function trackInicioSimulacro(categoria: string, modo: 'examen' | 'practica') {
  trackEvent('inicio_simulacro', { categoria, modo });
}

export function trackFinSimulacro(opts: {
  categoria: string;
  aprobado: boolean;
  puntaje: number;
  total: number;
}) {
  trackEvent('fin_simulacro', {
    categoria: opts.categoria,
    aprobado: opts.aprobado ? 'si' : 'no',
    puntaje: opts.puntaje,
    total: opts.total,
  });
}

export function trackClickExplicacion(preguntaId: string) {
  trackEvent('click_explicacion', { pregunta_id: preguntaId });
}

export function trackRepasoErrores(cantidad: number) {
  trackEvent('repaso_errores', { cantidad });
}
