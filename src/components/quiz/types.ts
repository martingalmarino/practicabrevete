export interface QuizQuestion {
  id: string;
  categoria: string;
  tema: string;
  enunciado: string;
  opciones: string[];
  correcta: number;
  imagen?: { src: string; alt: string } | null;
  explicacion?: {
    texto: string;
    status: string;
    baseLegal: string;
  };
  slug: string;
  publish?: boolean;
  tipo?: 'general' | 'especifica';
}
