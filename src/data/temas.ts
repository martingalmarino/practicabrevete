import type { TemaId } from './tipos';

export interface Tema {
  slug: TemaId;
  nombre: string;
  descripcion: string;
  accion: string;
  /** Nombre del icono SVG inline */
  icon: 'sign' | 'priority' | 'speed' | 'docs' | 'aid' | 'wrench';
}

export const temas: Tema[] = [
  {
    slug: 'senales',
    nombre: 'Señales de tránsito',
    descripcion: 'Reconoce las señales y entiende qué indican.',
    accion: 'Practicar señales',
    icon: 'sign',
  },
  {
    slug: 'prioridad',
    nombre: 'Prioridad de paso',
    descripcion: 'Aprende quién pasa primero en cruces y adelantamientos.',
    accion: 'Practicar prioridad',
    icon: 'priority',
  },
  {
    slug: 'velocidades',
    nombre: 'Velocidades',
    descripcion: 'Repasa límites y criterios de velocidad segura.',
    accion: 'Practicar velocidades',
    icon: 'speed',
  },
  {
    slug: 'documentos',
    nombre: 'Documentos',
    descripcion: 'SOAT, identificación vehicular y papeles que debes portar.',
    accion: 'Practicar documentos',
    icon: 'docs',
  },
  {
    slug: 'primeros-auxilios',
    nombre: 'Primeros auxilios',
    descripcion: 'Actúa con calma ante un accidente hasta que llegue ayuda.',
    accion: 'Practicar auxilios',
    icon: 'aid',
  },
  {
    slug: 'mecanica',
    nombre: 'Mecánica básica',
    descripcion: 'Revisiones esenciales del vehículo que todo conductor debe conocer.',
    accion: 'Practicar mecánica',
    icon: 'wrench',
  },
];

export function getTema(slug: string): Tema | undefined {
  return temas.find((t) => t.slug === slug);
}
