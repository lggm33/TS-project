import type { ExerciseId } from "./identifiers.js";

const ExerciseCategory = {
  CARDIO: 'cardio',
  STRENGTH: 'fuerza',
  FLEXIBILITY: 'flexibilidad',
} as const;

type ExerciseCategoryType = (typeof ExerciseCategory)[keyof typeof ExerciseCategory];

const WorkoutStatus = {
  PENDING: 'pendiente',
  COMPLETED: 'completado',
  SKIPPED: 'saltado',
} as const;

type WorkoutStatusType = (typeof WorkoutStatus)[keyof typeof WorkoutStatus];

interface BaseExercise {
  id: ExerciseId;
  name: string;
  duration: number;
  caloriesPerMinute: number;
  status: WorkoutStatusType;
}

interface CardioExercise extends BaseExercise {
  category: typeof ExerciseCategory.CARDIO;
  distance: number;
  pace: number;
  heartRateZone: number;
  finalCaloriesBurned: number;
}

interface StrengthExercise extends BaseExercise {
  category: typeof ExerciseCategory.STRENGTH;
  sets: number;
  reps: number;
  weight: number;
  finalWeightLifted: number;
}

interface FlexibilityExercise extends BaseExercise {
  category: typeof ExerciseCategory.FLEXIBILITY;
  poses: number;
  finalCommentsUser: string;
}

type Exercise = CardioExercise | StrengthExercise | FlexibilityExercise;

export { ExerciseCategory, WorkoutStatus };
export type {
  Exercise,
  BaseExercise,
  CardioExercise,
  StrengthExercise,
  FlexibilityExercise,
  ExerciseCategoryType,
  WorkoutStatusType,
};
