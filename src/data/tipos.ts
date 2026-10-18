export type TemaId =
  | 'senales'
  | 'prioridad'
  | 'velocidades'
  | 'documentos'
  | 'primeros-auxilios'
  | 'mecanica';

export type ExplicacionStatus = 'revisar' | 'revisada';

export interface PreguntaImagen {
  src: string;
  alt: string;
}

export interface Explicacion {
  texto: string;
  status: ExplicacionStatus;
  baseLegal: string;
}

export interface Pregunta {
  id: string;
  categoria: string;
  tema: TemaId;
  temaFuente?: string;
  enunciado: string;
  opciones: string[];
  correcta: number;
  imagen?: PreguntaImagen | null;
  explicacion?: Explicacion;
  slug: string;
  publish: boolean;
  fuente: string;
  updatedAt: string;
}
