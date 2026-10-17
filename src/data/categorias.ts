export interface Categoria {
  slug: string;
  codigo: string;
  nombre: string;
  descripcionCorta: string;
  /** Texto propio para la página de simulacro (qué evalúa) */
  evalua: string;
  /** true cuando hay banco de preguntas cargado */
  disponible: boolean;
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
    slug: 'b-iic',
    codigo: 'B-IIc',
    nombre: 'Clase B — Categoría II-C (motos)',
    descripcionCorta: 'Orientada a motocicletas según el balotario de clase B.',
    evalua:
      'Preguntas del balotario B-II-C enfocadas en conducción de motos y normas aplicables. Banco en preparación; puedes estudiar mientras tanto con las guías generales de señales y prioridad.',
    disponible: false,
  },
];

export function getCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}
