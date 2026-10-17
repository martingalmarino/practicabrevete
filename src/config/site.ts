export const site = {
  name: 'Practica Brevete',
  tagline: 'Simulador gratuito del examen de reglas de tránsito en Perú',
  description:
    'Practica el examen de conocimientos para el brevete con explicaciones, repaso de errores y progreso. Sitio independiente, no oficial.',
  url: 'https://practicabrevete.pe',
  domain: 'practicabrevete.pe',
  email: 'contacto@practicabrevete.pe',
  locale: 'es-PE',
  language: 'es',
  /** Año del balotario de preguntas utilizado como fuente */
  bancoPreguntasYear: 2021,
  lastContentReview: '2026-03-17',
  examRules: {
    questionCount: 40,
    passScore: 35,
    timeLimitMinutes: 40,
    /** Fuente verificada: orientación gob.pe (examen de reglas de tránsito) */
    sourceUrl:
      'https://www.gob.pe/139-obtener-primera-licencia-de-conducir-brevete-examen-de-reglas-de-transito',
    sourceNote:
      'El examen oficial dura hasta 40 minutos, tiene 40 preguntas y se aprueba con al menos 35 correctas.',
  },
  sources: {
    balotarios:
      'https://www.gob.pe/institucion/mtc/informes-publicaciones/1928110-examen-de-conocimientos-para-postulantes-a-licencias-de-conducir',
    reglamento: 'D.S. 016-2009-MTC y modificatorias (Reglamento Nacional de Tránsito)',
  },
  social: {
    twitter: '',
  },
  adsense: {
    /** Dejar vacío hasta tener ID aprobado; los slots no cargan scripts */
    clientId: '',
    slots: {
      homeTop: '',
      contentInline: '',
      sidebar: '',
    },
  },
  analytics: {
    /** ID de medición GA4, ej. G-XXXXXXXX */
    ga4Id: '',
  },
} as const;

export type SiteConfig = typeof site;
