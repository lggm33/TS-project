import type { UserService } from "./services/UserService.js";
import type { ExerciseService } from "./services/ExerciseService.js";
import { ExerciseCategory, UserLevel, MembershipPlan } from "./types/index.js";

export function seedData(userService: UserService, exerciseService: ExerciseService): void {
  userService.createTrainer({
    type: "trainer",
    personal: {
      type: "trainer",
      name: "Carlos Méndez",
      age: 35,
      email: "carlos@gym.com",
      gender: "masculino",
    },
  });

  userService.createStudent({
    type: "student",
    routine_name: "Rutina de inicio",
    personal: {
      type: "student",
      name: "Ana García",
      age: 24,
      email: "ana@gmail.com",
      gender: "femenino",
      weight: 62,
      height: 165,
      goal: "perder peso",
      level: UserLevel.BEGINNER,
    },
    membership: {
      plan: MembershipPlan.BASIC,
      startDate: new Date(),
      active: true,
    },
  });

  exerciseService.createExerciseTemplate({
    name: "Running",
    category: ExerciseCategory.CARDIO,
    duration: 45,
    caloriesPerMinute: 10,
    distance: 5.2,
    heartRateZone: 3,
  });

  exerciseService.createExerciseTemplate({
    name: "Cycling",
    category: ExerciseCategory.CARDIO,
    duration: 60,
    caloriesPerMinute: 8,
    distance: 20,
    heartRateZone: 2,
  });

  exerciseService.createExerciseTemplate({
    name: "Bench Press",
    category: ExerciseCategory.STRENGTH,
    duration: 30,
    caloriesPerMinute: 7,
    sets: 4,
    reps: 10,
    weight: 60,
  });

  exerciseService.createExerciseTemplate({
    name: "Barbell Row",
    category: ExerciseCategory.STRENGTH,
    duration: 45,
    caloriesPerMinute: 7,
    sets: 4,
    reps: 10,
    weight: 80,
  });

  exerciseService.createExerciseTemplate({
    name: "Pull-up",
    category: ExerciseCategory.STRENGTH,
    duration: 30,
    caloriesPerMinute: 6,
    sets: 4,
    reps: 8,
    weight: 25,
  });

  exerciseService.createExerciseTemplate({
    name: "Seated Row",
    category: ExerciseCategory.STRENGTH,
    duration: 40,
    caloriesPerMinute: 6,
    sets: 4,
    reps: 10,
    weight: 45,
  });

  exerciseService.createExerciseTemplate({
    name: "Lat Pulldown",
    category: ExerciseCategory.STRENGTH,
    duration: 35,
    caloriesPerMinute: 6,
    sets: 4,
    reps: 10,
    weight: 50,
  });

  exerciseService.createExerciseTemplate({
    name: "Yoga Flow",
    category: ExerciseCategory.FLEXIBILITY,
    duration: 40,
    caloriesPerMinute: 3,
    poses: 12,
  });
}
