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
    descripcionCorta: 'Licencia profesional para taxis y transporte de pasajeros (requiere 2 años con A-I).',
    evalua:
      'Evalúa conocimientos de reglas de tránsito, señales, seguridad vial y normas aplicables a la conducción profesional de vehículos de transporte de pasajeros. Requiere haber tenido licencia A-I por al menos 2 años.',
    disponible: true,
    seoTitle: 'Simulacro A-IIa: examen de reglas para licencia profesional de taxi',
    metaDescription:
      'Simulacro gratuito del examen A-IIa (licencia profesional para taxis y transporte de pasajeros): 40 preguntas del balotario oficial MTC. Sitio no oficial.',
    h1: 'Simulacro del examen de reglas A-IIa (taxi y transporte de pasajeros)',
    respuestaDirecta:
      'El examen de reglas para la licencia A-IIa evalúa conocimientos de tránsito y seguridad vial para conductores profesionales. Tiene 40 preguntas (20 generales + 20 específicas), dura 40 minutos y se aprueba con al menos 35 correctas. Este simulacro usa el balotario oficial del MTC y es gratuito y no oficial.',
    faqs: [
      {
        q: '¿Cuántas preguntas tiene el examen A-IIa y con cuántas apruebo?',
        a: 'El examen tiene 40 preguntas: 20 de materias generales y 20 de la categoría específica. Se aprueba con al menos 35 correctas. El tiempo es de 40 minutos.',
        fuenteUrl: 'https://portal.mtc.gob.pe/transportes/terrestre/documentos/RD_Topicos_evaluacion_de_conocimientos.pdf',
      },
      {
        q: '¿Qué se necesita para sacar brevete A-IIa?',
        a: 'Debes tener licencia A-I vigente por al menos 2 años, aprobar el examen de reglas (conocimientos), el examen de manejo y el examen psicosomático.',
        fuenteUrl: 'https://www.gob.pe/262-tipos-de-licencia-de-conducir-brevete',
      },
      {
        q: '¿Qué puedo manejar con A-IIa?',
        a: 'Vehículos de la categoría M1 para servicio de transporte (taxis y transporte turístico de pasajeros), además de lo que permite A-I.',
        fuenteUrl: 'https://www.gob.pe/262-tipos-de-licencia-de-conducir-brevete',
      },
      {
        q: '¿Dónde está el balotario oficial A-IIa?',
        a: 'El balotario vigente fue aprobado por la RD N.° 004-2020-MTC/18, publicado el 17 de mayo de 2021.',
        fuenteUrl: 'https://www.gob.pe/institucion/mtc/informes-publicaciones/1928110-examen-de-conocimientos-para-postulantes-a-licencias-de-conducir',
      },
    ],
    balotarioUrl: 'https://www.gob.pe/institucion/mtc/informes-publicaciones/1928110-examen-de-conocimientos-para-postulantes-a-licencias-de-conducir',
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
