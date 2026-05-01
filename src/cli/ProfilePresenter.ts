import type { User, Exercise } from "../types/index.js";
import {
  calculateDailyCalories,
  calculateWeeklyCalories,
  getHighestCalorieDay,
} from "../utils/calculations.js";
import { describeExercise } from "../utils/exerciseFormatters.js";
import { formatDuration, capitalizeString } from "../utils/formatters.js";

export class ProfilePresenter {
  public static printExerciseStats(exercise: Exercise): string {
    return describeExercise(exercise);
  }

  public static printUserProfile(user: User): void {
    const { personal, membership, routine } = user;
    const trainedDays = ProfilePresenter.collectTrainedDays(routine);
    const totalCalories = calculateWeeklyCalories(routine);
    const averageCalories = ProfilePresenter.calculateAverage(totalCalories, trainedDays.length);
    const topDay = getHighestCalorieDay(routine);
    const startDate = membership.startDate.toISOString().slice(0, 10);

    console.log(`\n👤 Perfil de Usuario
══════════════════════════════════
   Nombre:       ${personal.name}
   Edad:         ${personal.age}
   Nivel:        ${personal.level}
   Objetivo:     ${personal.goal}

🪪 Membresía
──────────────────────────────────
   Plan:         ${membership.plan}
   Inicio:       ${startDate}
   Activa:       ${membership.active ? 'sí' : 'no'}

📋 Rutina Semanal
──────────────────────────────────`);

    for (const [day, dailyRoutine] of trainedDays) {
      const calories = calculateDailyCalories(dailyRoutine);
      const timeFormatted = formatDuration(dailyRoutine.exercise.duration);

      const paddedDay = capitalizeString(day).padEnd(10);
      const paddedName = dailyRoutine.exercise.name.padEnd(14);
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

  private static collectTrainedDays(routine: User["routine"]): [string, NonNullable<User["routine"]["plan"][keyof User["routine"]["plan"]]>][] {
    const result: [string, NonNullable<User["routine"]["plan"][keyof User["routine"]["plan"]]>][] = [];
    for (const [day, dailyRoutine] of Object.entries(routine.plan)) {
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
