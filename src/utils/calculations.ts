import type {
  Exercise,
  CardioExercise,
  StrengthExercise,
  FlexibilityExercise,
} from "../types/exercise.js";
import { ExerciseCategory } from "../types/exercise.js";
import type { DailyRoutine, WeeklyRoutine } from "../types/routine.js";

export interface ExercisesByCategory {
  cardio: CardioExercise[];
  strength: StrengthExercise[];
  flexibility: FlexibilityExercise[];
}

export interface CategorySummary {
  count: number;
  minutes: number;
  calories: number;
}

export interface CategoryTotals {
  cardio: CategorySummary;
  strength: CategorySummary;
  flexibility: CategorySummary;
}

export interface CategoryCounters {
  cardio: number;
  strength: number;
  flexibility: number;
}

export function calculateTotalCalories(exercise: Exercise): number {
  return exercise.caloriesPerMinute * exercise.duration;
}

export function calculateDailyCalories(routine: DailyRoutine): number {
  let totalCalories = 0;
  for (const exercise of routine.exercises) {
    totalCalories += calculateTotalCalories(exercise);
  }
  return totalCalories;
}

export function calculateWeeklyCalories(routine: WeeklyRoutine): number {
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
  routine: WeeklyRoutine,
): { day: string; calories: number } | null {
  const entries = Object.entries(routine.plan).filter(
    ([, r]) => r !== undefined,
  ) as [string, DailyRoutine][];

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

export function groupByCategory(exercises: Exercise[]): ExercisesByCategory {
  const groups: ExercisesByCategory = {
    cardio: [],
    strength: [],
    flexibility: [],
  };

  for (const exercise of exercises) {
    switch (exercise.category) {
      case ExerciseCategory.CARDIO:
        groups.cardio.push(exercise);
        break;
      case ExerciseCategory.STRENGTH:
        groups.strength.push(exercise);
        break;
      case ExerciseCategory.FLEXIBILITY:
        groups.flexibility.push(exercise);
        break;
    }
  }

  return groups;
}

export function sumByCategory(exercises: Exercise[]): CategoryTotals {
  const groups = groupByCategory(exercises);
  return {
    cardio: summarizeGroup(groups.cardio),
    strength: summarizeGroup(groups.strength),
    flexibility: summarizeGroup(groups.flexibility),
  };
}

export function countByCategory(exercises: Exercise[]): CategoryCounters {
  const groups = groupByCategory(exercises);
  return {
    cardio: groups.cardio.length,
    strength: groups.strength.length,
    flexibility: groups.flexibility.length,
  };
}

function summarizeGroup(exercises: Exercise[]): CategorySummary {
  let minutes = 0;
  let calories = 0;

  for (const exercise of exercises) {
    minutes += exercise.duration;
    calories += calculateTotalCalories(exercise);
  }

  return {
    count: exercises.length,
    minutes,
    calories,
  };
}
