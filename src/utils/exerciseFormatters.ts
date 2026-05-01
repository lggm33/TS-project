import type {
  Ejercicio,
  EjercicioCardio,
  EjercicioFuerza,
  EjercicioFlexibilidad,
} from "../types/ejercicio.js";
import { CategoriaEjercicio } from "../types/ejercicio.js";
import { calculateTotalCalories } from "./calculations.js";

const ETIQUETAS_CATEGORIA: Readonly<Record<Ejercicio["categoria"], { emoji: string; label: string }>> = {
  cardio: { emoji: '🏃', label: 'Cardio' },
  fuerza: { emoji: '💪', label: 'Fuerza' },
  flexibilidad: { emoji: '🧘', label: 'Flexibilidad' },
};

export function describirEjercicio(ejercicio: Ejercicio): string {
  switch (ejercicio.categoria) {
    case CategoriaEjercicio.CARDIO:
      return describirCardio(ejercicio);
    case CategoriaEjercicio.FUERZA:
      return describirFuerza(ejercicio);
    case CategoriaEjercicio.FLEXIBILIDAD:
      return describirFlexibilidad(ejercicio);
  }
}

export function obtenerEtiquetaCategoria(categoria: Ejercicio["categoria"]): { emoji: string; label: string } {
  return ETIQUETAS_CATEGORIA[categoria];
}

function describirCardio(ejercicio: EjercicioCardio): string {
  const totalCalorias = calculateTotalCalories(ejercicio);
  return `${ejercicio.nombre}, ${ejercicio.duracion} min | ${formatearDistancia(ejercicio.distancia_recorrida)} km | Ritmo: ${formatearRitmo(ejercicio.ritmo)} min/km | ${totalCalorias} kcal`;
}

function describirFuerza(ejercicio: EjercicioFuerza): string {
  const totalCalorias = calculateTotalCalories(ejercicio);
  return `${ejercicio.nombre}, ${ejercicio.series} series x ${ejercicio.repeticiones} reps | ${ejercicio.peso} kg | ${totalCalorias} kcal`;
}

function describirFlexibilidad(ejercicio: EjercicioFlexibilidad): string {
  const totalCalorias = calculateTotalCalories(ejercicio);
  return `${ejercicio.nombre}, ${ejercicio.numero_poses} poses | ${totalCalorias} kcal`;
}

function formatearDistancia(distanciaKm: number): string {
  return distanciaKm.toFixed(1);
}

function formatearRitmo(ritmo: number): string {
  return ritmo.toFixed(2);
}
