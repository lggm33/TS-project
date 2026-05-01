import type {
  Exercise,
  CardioExercise,
  StrengthExercise,
  FlexibilityExercise,
} from "../types/exercise.js";
import { ExerciseCategory } from "../types/exercise.js";
import { calculateTotalCalories } from "./calculations.js";

const CATEGORY_LABELS: Readonly<Record<Exercise["category"], { emoji: string; label: string }>> = {
  cardio: { emoji: '🏃', label: 'Cardio' },
  fuerza: { emoji: '💪', label: 'Fuerza' },
  flexibilidad: { emoji: '🧘', label: 'Flexibilidad' },
};

export function describeExercise(exercise: Exercise): string {
  switch (exercise.category) {
    case ExerciseCategory.CARDIO:
      return describeCardio(exercise);
    case ExerciseCategory.STRENGTH:
      return describeStrength(exercise);
    case ExerciseCategory.FLEXIBILITY:
      return describeFlexibility(exercise);
  }
}

export function getCategoryLabel(category: Exercise["category"]): { emoji: string; label: string } {
  return CATEGORY_LABELS[category];
}

function describeCardio(exercise: CardioExercise): string {
  const totalCalories = calculateTotalCalories(exercise);
  return `${exercise.name}, ${exercise.duration} min | ${formatDistance(exercise.distance)} km | Ritmo: ${formatPace(exercise.pace)} min/km | ${totalCalories} kcal`;
}

function describeStrength(exercise: StrengthExercise): string {
  const totalCalories = calculateTotalCalories(exercise);
  return `${exercise.name}, ${exercise.sets} series x ${exercise.reps} reps | ${exercise.weight} kg | ${totalCalories} kcal`;
}

function describeFlexibility(exercise: FlexibilityExercise): string {
  const totalCalories = calculateTotalCalories(exercise);
  return `${exercise.name}, ${exercise.poses} poses | ${totalCalories} kcal`;
}

function formatDistance(distanceKm: number): string {
  return distanceKm.toFixed(1);
}

function formatPace(pace: number): string {
  return pace.toFixed(2);
}
