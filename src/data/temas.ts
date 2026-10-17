import type { TemaId } from './tipos';

export interface Tema {
  slug: TemaId;
  nombre: string;
  descripcion: string;
}

export const temas: Tema[] = [
  {
    slug: 'senales',
    nombre: 'Señales de tránsito',
    descripcion:
      'Señales verticales, semáforos y marcas en el pavimento: qué significan y cómo debes actuar.',
  },
  {
    slug: 'prioridad',
    nombre: 'Prioridad de paso',
    descripcion:
      'Intersecciones, adelantamientos, vehículos de emergencia y reglas cuando no hay semáforo.',
  },
  {
    slug: 'velocidades',
    nombre: 'Velocidades',
    descripcion: 'Límites y criterios de velocidad segura según el tipo de vía y la situación.',
  },
  {
    slug: 'documentos',
    nombre: 'Documentos',
    descripcion: 'SOAT, identificación vehicular, licencia y otros papeles que debes portar.',
  },
  {
    slug: 'primeros-auxilios',
    nombre: 'Primeros auxilios',
    descripcion: 'Actuación básica ante un accidente mientras llega ayuda profesional.',
  },
  {
    slug: 'mecanica',
    nombre: 'Mecánica básica',
    descripcion: 'Revisiones esenciales del vehículo que todo conductor debe conocer.',
  },
];

export function getTema(slug: string): Tema | undefined {
  return temas.find((t) => t.slug === slug);
}
