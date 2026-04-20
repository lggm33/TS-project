import type { Usuario, Ejercicio } from "../types/index.js";
import { 
  calculateTotalCalories, 
  calculatePace, 
  calculateDailyCalories, 
  calculateWeeklyCalories, 
  getHighestCalorieDay 
} from "../utils/calculations.js";
import { formatDuration, capitalizeString } from "../utils/formatters.js";

export class ProfilePresenter {
  public static printExerciseStats(exercise: Ejercicio): string {
    const totalCalories = calculateTotalCalories(exercise);
    const timeFormatted = formatDuration(exercise.duracion);
    
    let stats = `
    Ejercicio: ${exercise.nombre}
    Descripción: ${exercise.descripcion}
    Duración: ${timeFormatted}
    Calorías por minuto: ${exercise.calorias_por_minuto}
    Calorías totales: ${totalCalories} kcal
    Duración total: ${timeFormatted}`;

    if (exercise.distancia !== undefined) {
      const distanceKm = exercise.distancia / 1000;
      const pace = calculatePace(exercise.duracion, exercise.distancia);
      stats += `\n    Distancia: ${distanceKm} km`;
      stats += `\n    Ritmo: ${pace} min/km`;
    }

    return stats;
  }

  public static printUserProfile(user: Usuario): void {
    const { nombre, edad, rutina, nivel, objetivo } = user;
    const plan = rutina.plan;
    const trainedDays = Object.entries(plan).filter(([, r]) => r !== undefined);
    const totalCalories = calculateWeeklyCalories(rutina);
    
    let averageCalories = 0;
    if (trainedDays.length > 0) {
      averageCalories = Math.round(totalCalories / trainedDays.length);
    }
    
    const topDay = getHighestCalorieDay(rutina);

    console.log(`\n👤 Perfil de Usuario
══════════════════════════════════
   Nombre: ${nombre}
   Edad: ${edad}
   Nivel: ${nivel}
   Objetivo: ${objetivo}

📋 Rutina Semanal: ${rutina.id === 1 ? 'Plan Full Body' : 'Plan Personalizado'}
──────────────────────────────────`);

    for (const [day, dailyRoutine] of trainedDays) {
      if (dailyRoutine !== undefined) {
        const exercise = dailyRoutine.ejercicio;
        const calories = calculateDailyCalories(dailyRoutine);
        const timeFormatted = formatDuration(exercise.duracion);
        
        const paddedDay = capitalizeString(day).padEnd(10);
        const paddedName = exercise.nombre.padEnd(10);
        const paddedTime = timeFormatted.padEnd(6);
        
        console.log(`   ${paddedDay}: ${paddedName} - ${paddedTime} (${calories} cal)`);
      }
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
}
