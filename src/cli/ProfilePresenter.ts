import type { UserService } from "../services/UserService.js";
import type { User, Exercise, Student, Trainer } from "../types/index.js";
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

  public static printTrainerProfile(user: Trainer, userService: UserService): void {
    console.log(`──────────────────────────────────`);
    console.log(`👩‍🏫 Instructor: ${user.personal.name}`);
    console.log(`──────────────────────────────────\n`);

    const { users_assigned } = user;

    if (users_assigned.length === 0) {
      console.log("No hay usuarios asignados\n");
      return;
    }

    for (const userId of users_assigned) {
      const assignedUser = userService.getUser(userId);
      if (assignedUser && assignedUser.personal.type === 'student') {
        const student = assignedUser as Student;
        const routine = student.routine;
        const trainedDays = ProfilePresenter.collectTrainedDays(routine);
        
        let totalMinutes = 0;
        for (const [day, dailyRoutine] of trainedDays) {
          for (const exercise of dailyRoutine.exercises) {
            totalMinutes += exercise.duration;
          }
        }
        
        const totalCalories = calculateWeeklyCalories(routine);
        const routineName = routine.rutine_name || 'Plan de Entrenamiento';

        console.log(`${student.personal.name} (${student.personal.level})`);
        console.log(`Rutina: ${routineName}`);
        console.log(`Semana: ${trainedDays.length} días | ${totalMinutes} min | ${totalCalories} kcal\n`);
      }
    }
  }

  public static printUserGeneralProfile(user: User): void {
    console.log(`\n👤 Perfil de Usuario
    ══════════════════════════════════
      Nombre:       ${user.personal.name}
      Email:        ${user.personal.email}
      Sexo:         ${user.personal.gender}
      Tipo:         ${user.personal.type}
    `);
  }

  public static printStudenProfile(user: Student): void {
    if (user.personal.type !== "student") {
      throw new Error("Usuario no es un estudiante");
    }

    const { routine } = user;
    const trainedDays = ProfilePresenter.collectTrainedDays(routine);
    
    // Calcular totales
    let totalMinutes = 0;
    let totalCalories = 0;
    let cardioMin = 0;
    let strengthMin = 0;
    let flexMin = 0;
    let activeDaysCount = 0;

    for (const [, dailyRoutine] of trainedDays) {
      if (dailyRoutine.exercises.length > 0) {
        activeDaysCount++;
      }
      for (const ex of dailyRoutine.exercises) {
        totalMinutes += ex.duration;
        totalCalories += (ex.caloriesPerMinute * ex.duration);
        if (ex.category === 'cardio') cardioMin += ex.duration;
        if (ex.category === 'fuerza') strengthMin += ex.duration;
        if (ex.category === 'flexibilidad') flexMin += ex.duration;
      }
    }

    const averageCalories = activeDaysCount > 0 ? Math.round(totalCalories / activeDaysCount) : 0;
    const routineName = routine.rutine_name || 'Plan de Entrenamiento';

    console.log(`\n👤 Perfil de Usuario`);
    console.log(`══════════════════════════════════`);
    console.log(`Nombre: ${user.personal.name}  |  Edad: ${user.personal.age}  |  Nivel: ${user.personal.level}\n`);
    
    console.log(`📋 Rutina: ${routineName}`);
    console.log(`──────────────────────────────────`);

    for (const [day, dailyRoutine] of trainedDays) {
      const exercises = dailyRoutine.exercises;
      const capitalizedDay = capitalizeString(day);
      
      if (exercises.length === 0) {
        console.log(`${capitalizedDay}: (descanso)\n`);
        continue;
      }

      console.log(`${capitalizedDay}:`);
      for (const ex of exercises) {
        const statusIcon = ex.completed ? '✅' : '❌';
        let extraInfo = '';
        
        if (ex.category === 'fuerza' && 'finalWeightLifted' in ex) {
          extraInfo = ` | ${ex.finalWeightLifted || ex.weight}kg levantados`;
        } else if (ex.category === 'cardio' && 'finalCaloriesBurned' in ex) {
          const burned = ex.finalCaloriesBurned || (ex.caloriesPerMinute * ex.duration);
          extraInfo = ` | ${Math.round(burned)} kcal quemadas`;
        }
        
        console.log(`  ${statusIcon} ${ex.name} [${ex.category}], ${ex.duration} min${extraInfo}`);
      }
      
      if (dailyRoutine.comments) {
        console.log(`  💬 "${dailyRoutine.comments}"`);
      }
      console.log(); // Salto de línea entre días
    }

    console.log(`──────────────────────────────────`);
    console.log(`Total semanal: ${Math.round(totalCalories)} kcal  |  Promedio: ${averageCalories} kcal (${activeDaysCount} días entrenados)\n`);

    console.log(`📊 Carga semanal`);
    console.log(`${totalMinutes} min  |  ${Math.round(totalCalories)} kcal`);
    console.log(`🏃 Cardio: ${cardioMin} min    💪 Fuerza: ${strengthMin} min    🧘 Flexibilidad: ${flexMin} min`);
    
    if (activeDaysCount > 5 || totalMinutes > 300) {
      console.log(`⚠️ Estás entrenando mucho. Considera tomar un descanso para evitar el sobreentrenamiento.`);
    } else if (activeDaysCount < 3 || totalMinutes < 150) {
      console.log(`⚠️ Considerá agregar más tiempo o días de entrenamiento esta semana.`);
    }
    
    console.log(`══════════════════════════════════\n`);
  }

  private static collectTrainedDays(routine: Student["routine"]): [string, NonNullable<Student["routine"]["plan"][keyof Student["routine"]["plan"]]>][] {
    const result: [string, NonNullable<Student["routine"]["plan"][keyof Student["routine"]["plan"]]>][] = [];
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
