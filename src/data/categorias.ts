export interface FAQ {
  q: string;
  a: string;
  fuenteUrl?: string;
}

export interface Categoria {
  slug: string;
  codigo: string;
  nombre: string;
  descripcionCorta: string;
  /** Texto propio para la página de simulacro (qué evalúa) */
  evalua: string;
  /** true cuando hay banco de preguntas cargado */
  disponible: boolean;
  /** SEO: title personalizado */
  seoTitle?: string;
  /** SEO: meta description personalizada */
  metaDescription?: string;
  /** SEO: H1 personalizado */
  h1?: string;
  /** AEO: párrafo de respuesta directa */
  respuestaDirecta?: string;
  /** FAQs visibles */
  faqs?: FAQ[];
  /** URL del balotario oficial */
  balotarioUrl?: string;
}

export const categorias: Categoria[] = [
  {
    slug: 'a-i',
    codigo: 'A-I',
    nombre: 'Clase A — Categoría I',
    descripcionCorta: 'Licencia no profesional para automóviles y similares (la más solicitada).',
    evalua:
      'Evalúa reglas de tránsito, señales, prioridad de paso, documentos, velocidades y nociones de seguridad vial para conductores no profesionales. Es la categoría habitual para quien busca su primer brevete de auto.',
    disponible: true,
  },
  {
    slug: 'a-iia',
    codigo: 'A-IIa',
    nombre: 'Clase A — Categoría II-A',
    descripcionCorta: 'Categoría profesional intermedia de clase A.',
    evalua:
      'Profundiza en normas aplicables a la conducción profesional de vehículos de mayor responsabilidad. El banco completo se incorpora desde el balotario público correspondiente.',
    disponible: false,
  },
  {
    slug: 'a-iib',
    codigo: 'A-IIb',
    nombre: 'Clase A — Categoría II-B',
    descripcionCorta: 'Categoría profesional de clase A.',
    evalua:
      'Incluye tópicos del balotario A-II-B orientados a servicio de transporte. Próximamente disponible tras cargar el PDF oficial.',
    disponible: false,
  },
  {
    slug: 'a-iiia',
    codigo: 'A-IIIa',
    nombre: 'Clase A — Categoría III-A',
    descripcionCorta: 'Categoría profesional avanzada.',
    evalua: 'Cubre el balotario A-III-A para conductores profesionales. Banco en preparación.',
    disponible: false,
  },
  {
    slug: 'a-iiib',
    codigo: 'A-IIIb',
    nombre: 'Clase A — Categoría III-B',
    descripcionCorta: 'Categoría profesional avanzada.',
    evalua: 'Cubre el balotario A-III-B. Banco en preparación.',
    disponible: false,
  },
  {
    slug: 'a-iiic',
    codigo: 'A-IIIc',
    nombre: 'Clase A — Categoría III-C',
    descripcionCorta: 'Categoría profesional de mayor alcance en clase A.',
    evalua: 'Cubre el balotario A-III-C. Banco en preparación.',
    disponible: false,
  },
  {
    slug: 'b-iib',
    codigo: 'B-IIb',
    nombre: 'Clase B — Categoría II-B (moto lineal)',
    descripcionCorta: 'Licencia para motos lineales y motos con sidecar (incluye bicimotos).',
    evalua:
      '40 preguntas de materias generales del balotario oficial de clase B categorías II-a y II-b (RD N.° 004-2020-MTC/18): reglas de tránsito, señales, documentos, SOAT y temas propios de la conducción en moto.',
    disponible: true,
    seoTitle: 'Simulacro B2B moto lineal (B-IIb): examen de reglas MTC',
    metaDescription:
      'Simulacro gratis del examen de reglas B-IIb (B2B) para moto lineal: 40 preguntas al azar del balotario oficial del MTC (RD 004-2020). Sitio no oficial.',
    h1: 'Simulacro del examen de reglas B-IIb (B2B) para moto lineal',
    respuestaDirecta:
      'El examen de reglas para la licencia B-IIb (moto lineal) tiene 40 preguntas de materias generales, dura 40 minutos y se aprueba con al menos 35 correctas, según la directiva de evaluación de conocimientos del MTC. Las preguntas salen del balotario de clase B II-a y II-b aprobado por la RD N.° 004-2020-MTC/18. Este simulacro es gratuito y no oficial.',
    faqs: [
      {
        q: '¿Cuántas preguntas tiene el examen de reglas B-IIb y con cuántas apruebo?',
        a: 'El examen tiene 40 preguntas y se aprueba con al menos 35 correctas. El tiempo es de 40 minutos.',
        fuenteUrl: 'https://portal.mtc.gob.pe/transportes/terrestre/documentos/RD_Topicos_evaluacion_de_conocimientos.pdf',
      },
      {
        q: '¿Las preguntas del B-IIb son distintas a las del A-I?',
        a: 'Para B-IIa y B-IIb las 40 preguntas son de materias generales. En el balotario 2020, la mayoría de las preguntas coinciden con el A-I y un grupo trata temas propios de moto (casco, pasajero, postura, frenado).',
        fuenteUrl: 'https://cdn.www.gob.pe/uploads/document/file/3298271/Balotario%20clase%20B%20categor%C3%ADas%20II-a%20y%20II-b.pdf.pdf',
      },
      {
        q: '¿Qué puedo manejar con brevete B-IIb?',
        a: 'Bicimotos, motocicletas y motos con sidecar. Los mototaxis no (eso es B-IIc).',
        fuenteUrl: 'https://www.gob.pe/262-tipos-de-licencia-de-conducir-brevete',
      },
      {
        q: '¿Dónde se tramita el brevete de moto?',
        a: 'En la municipalidad de tu distrito o provincia. Los requisitos, costos y oportunidades cambian según la municipalidad.',
        fuenteUrl: 'https://www.gob.pe/22059-obtener-licencia-de-conducir-para-motos-y-mototaxis',
      },
      {
        q: '¿Dónde está el balotario oficial B-IIb?',
        a: 'El balotario vigente es el Anexo I de la RD N.° 004-2020-MTC/18, publicada en El Peruano el 03/03/2020.',
        fuenteUrl: 'https://cdn.www.gob.pe/uploads/document/file/3298271/Balotario%20clase%20B%20categor%C3%ADas%20II-a%20y%20II-b.pdf.pdf',
      },
    ],
    balotarioUrl: 'https://cdn.www.gob.pe/uploads/document/file/3298271/Balotario%20clase%20B%20categor%C3%ADas%20II-a%20y%20II-b.pdf.pdf',
  },
  {
    slug: 'b-iic',
    codigo: 'B-IIc',
    nombre: 'Clase B — Categoría II-C (mototaxi)',
    descripcionCorta: 'Para mototaxis y trimotos de pasajeros; incluye B-IIa y B-IIb.',
    evalua:
      'Preguntas del balotario B-II-C enfocadas en conducción de mototaxis y trimotos, con normas aplicables. Banco en preparación; puedes estudiar mientras tanto con las guías generales de señales y prioridad.',
    disponible: false,
  },
];

export function getCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}
