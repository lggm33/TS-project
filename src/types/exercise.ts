import type { ExerciseId } from "./identifiers.js";

const ExerciseCategory = {
  CARDIO: 'cardio',
  STRENGTH: 'fuerza',
  FLEXIBILITY: 'flexibilidad',
} as const;

type ExerciseCategoryType = (typeof ExerciseCategory)[keyof typeof ExerciseCategory];

interface BaseExercise {
  id: ExerciseId;
  name: string;
  duration: number;
  caloriesPerMinute: number;
}

interface CardioExercise extends BaseExercise {
  category: typeof ExerciseCategory.CARDIO;
  distance: number;
  pace: number;
  heartRateZone: number;
}

interface StrengthExercise extends BaseExercise {
  category: typeof ExerciseCategory.STRENGTH;
  sets: number;
  reps: number;
  weight: number;
}

interface FlexibilityExercise extends BaseExercise {
  category: typeof ExerciseCategory.FLEXIBILITY;
  poses: number;
}

type Exercise = CardioExercise | StrengthExercise | FlexibilityExercise;

export { ExerciseCategory };
export type {
  Exercise,
  BaseExercise,
  CardioExercise,
  StrengthExercise,
  FlexibilityExercise,
  ExerciseCategoryType,
};
