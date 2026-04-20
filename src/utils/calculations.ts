import type { Ejercicio, Rutina_Diaria, Rutina_Semanal } from "../types/index.js";

export function calculateTotalCalories(exercise: Ejercicio): number {
  const totalCalories = exercise.calorias_por_minuto * exercise.duracion;
  return totalCalories;
}

export function calculatePace(durationMinutes: number, distanceMeters: number): number {
  if (distanceMeters <= 0) {
    return 0;
  }
  
  const distanceKm = distanceMeters / 1000;
  const pace = durationMinutes / distanceKm;
  
  return Number(pace.toFixed(2));
}

export function calculateDailyCalories(routine: Rutina_Diaria): number {
  const dailyCalories = routine.ejercicio.calorias_por_minuto * routine.ejercicio.duracion;
  return dailyCalories;
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

export function getHighestCalorieDay(routine: Rutina_Semanal): { day: string; calories: number } | null {
  const entries = Object.entries(routine.plan).filter(([, r]) => r !== undefined) as [string, Rutina_Diaria][];
  
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
