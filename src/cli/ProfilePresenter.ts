import type { Usuario, Ejercicio } from "../types/index.js";
import {
  calculateDailyCalories,
  calculateWeeklyCalories,
  getHighestCalorieDay,
} from "../utils/calculations.js";
import { describirEjercicio } from "../utils/exerciseFormatters.js";
import { formatDuration, capitalizeString } from "../utils/formatters.js";

export class ProfilePresenter {
  public static printExerciseStats(exercise: Ejercicio): string {
    return describirEjercicio(exercise);
  }

  public static printUserProfile(user: Usuario): void {
    const { personal, membresia, rutina } = user;
    const trainedDays = ProfilePresenter.collectTrainedDays(rutina);
    const totalCalories = calculateWeeklyCalories(rutina);
    const averageCalories = ProfilePresenter.calculateAverage(totalCalories, trainedDays.length);
    const topDay = getHighestCalorieDay(rutina);
    const fechaInicio = membresia.fecha_inicio.toISOString().slice(0, 10);

    console.log(`\n👤 Perfil de Usuario
══════════════════════════════════
   Nombre:       ${personal.nombre}
   Edad:         ${personal.edad}
   Nivel:        ${personal.nivel}
   Objetivo:     ${personal.objetivo}

🪪 Membresía
──────────────────────────────────
   Plan:         ${membresia.plan}
   Inicio:       ${fechaInicio}
   Activa:       ${membresia.activa ? 'sí' : 'no'}

📋 Rutina Semanal
──────────────────────────────────`);

    for (const [day, dailyRoutine] of trainedDays) {
      const calories = calculateDailyCalories(dailyRoutine);
      const timeFormatted = formatDuration(dailyRoutine.ejercicio.duracion);

      const paddedDay = capitalizeString(day).padEnd(10);
      const paddedName = dailyRoutine.ejercicio.nombre.padEnd(14);
      const paddedTime = timeFormatted.padEnd(6);

      console.log(`   ${paddedDay}: ${paddedName} - ${paddedTime} (${calories} cal)`);
    }

    console.log(`──────────────────────────────────
   Total semanal:      ${totalCalories} cal
   Promedio diario:    ${averageCalories} cal (${trainedDays.length} días entrenados)`);

    if (topDay !== null) {
      const topDayName = capitalizeString(topDay.day);
      console.log(`   Día más intenso:    ${topDayName} (${topDay.calories} cal)`);
    }

    console.log(`══════════════════════════════════\n`);
  }

  private static collectTrainedDays(rutina: Usuario["rutina"]): [string, NonNullable<Usuario["rutina"]["plan"][keyof Usuario["rutina"]["plan"]]>][] {
    const result: [string, NonNullable<Usuario["rutina"]["plan"][keyof Usuario["rutina"]["plan"]]>][] = [];
    for (const [day, dailyRoutine] of Object.entries(rutina.plan)) {
      if (dailyRoutine !== undefined) {
        result.push([day, dailyRoutine]);
      }
    }
    return result;
  }

  private static calculateAverage(total: number, days: number): number {
    if (days <= 0) {
      return 0;
    }
    return Math.round(total / days);
  }
}
