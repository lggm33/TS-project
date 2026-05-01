import type { EjercicioId } from "./identificadores.js";

const CategoriaEjercicio = {
  CARDIO: 'cardio',
  FUERZA: 'fuerza',
  FLEXIBILIDAD: 'flexibilidad',
} as const;

type CategoriaEjercicioType = (typeof CategoriaEjercicio)[keyof typeof CategoriaEjercicio];

interface EjercicioBase {
  id: EjercicioId;
  nombre: string;
  duracion: number;
  calorias_por_minuto: number;
}

interface EjercicioCardio extends EjercicioBase {
  categoria: typeof CategoriaEjercicio.CARDIO;
  distancia_recorrida: number;
  ritmo: number;
  zona_frecuencia_cardiaca: number;
}

interface EjercicioFuerza extends EjercicioBase {
  categoria: typeof CategoriaEjercicio.FUERZA;
  series: number;
  repeticiones: number;
  peso: number;
}

interface EjercicioFlexibilidad extends EjercicioBase {
  categoria: typeof CategoriaEjercicio.FLEXIBILIDAD;
  numero_poses: number;
}

type Ejercicio = EjercicioCardio | EjercicioFuerza | EjercicioFlexibilidad;

export { CategoriaEjercicio };
export type {
  Ejercicio,
  EjercicioBase,
  EjercicioCardio,
  EjercicioFuerza,
  EjercicioFlexibilidad,
  CategoriaEjercicioType,
};
