import type {
  Ejercicio,
  EjercicioCardio,
  EjercicioFuerza,
  EjercicioFlexibilidad,
} from "../types/ejercicio.js";
import { CategoriaEjercicio } from "../types/ejercicio.js";
import type { Rutina_Diaria, Rutina_Semanal } from "../types/rutina.js";

export interface ExercisesByCategory {
  cardio: EjercicioCardio[];
  fuerza: EjercicioFuerza[];
  flexibilidad: EjercicioFlexibilidad[];
}

export interface CategorySummary {
  count: number;
  minutos: number;
  calorias: number;
}

export interface CategoryTotals {
  cardio: CategorySummary;
  fuerza: CategorySummary;
  flexibilidad: CategorySummary;
}

export interface CategoryCounters {
  cardio: number;
  fuerza: number;
  flexibilidad: number;
}

export function calculateTotalCalories(exercise: Ejercicio): number {
  return exercise.calorias_por_minuto * exercise.duracion;
}

export function calculateDailyCalories(routine: Rutina_Diaria): number {
  return calculateTotalCalories(routine.ejercicio);
}

export function calculateWeeklyCalories(routine: Rutina_Semanal): number {
  const days = Object.values(routine.plan);
  let totalCalories = 0;

  for (const day of days) {
    if (day !== undefined) {
      totalCalories += calculateDailyCalories(day);
    }
  }

  return totalCalories;
}

export function getHighestCalorieDay(
  routine: Rutina_Semanal,
): { day: string; calories: number } | null {
  const entries = Object.entries(routine.plan).filter(
    ([, r]) => r !== undefined,
  ) as [string, Rutina_Diaria][];

  if (entries.length === 0) {
    return null;
  }

  let maxDay = '';
  let maxCalories = -1;

  for (const [day, dailyRoutine] of entries) {
    const calories = calculateDailyCalories(dailyRoutine);
    if (calories > maxCalories) {
      maxCalories = calories;
      maxDay = day;
    }
  }

  return { day: maxDay, calories: maxCalories };
}

export function agruparPorCategoria(exercises: Ejercicio[]): ExercisesByCategory {
  const groups: ExercisesByCategory = {
    cardio: [],
    fuerza: [],
    flexibilidad: [],
  };

  for (const exercise of exercises) {
    switch (exercise.categoria) {
      case CategoriaEjercicio.CARDIO:
        groups.cardio.push(exercise);
        break;
      case CategoriaEjercicio.FUERZA:
        groups.fuerza.push(exercise);
        break;
      case CategoriaEjercicio.FLEXIBILIDAD:
        groups.flexibilidad.push(exercise);
        break;
    }
  }

  return groups;
}

export function sumarPorCategoria(exercises: Ejercicio[]): CategoryTotals {
  const groups = agruparPorCategoria(exercises);
  return {
    cardio: resumirGrupo(groups.cardio),
    fuerza: resumirGrupo(groups.fuerza),
    flexibilidad: resumirGrupo(groups.flexibilidad),
  };
}

export function contarPorCategoria(exercises: Ejercicio[]): CategoryCounters {
  const groups = agruparPorCategoria(exercises);
  return {
    cardio: groups.cardio.length,
    fuerza: groups.fuerza.length,
    flexibilidad: groups.flexibilidad.length,
  };
}

function resumirGrupo(exercises: Ejercicio[]): CategorySummary {
  let minutos = 0;
  let calorias = 0;

  for (const exercise of exercises) {
    minutos += exercise.duracion;
    calorias += calculateTotalCalories(exercise);
  }

  return {
    count: exercises.length,
    minutos,
    calorias,
  };
}
