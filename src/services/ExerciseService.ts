import type {
  Exercise,
  CardioExercise,
  StrengthExercise,
  FlexibilityExercise,
} from "../types/exercise.js";
import { ExerciseCategory } from "../types/exercise.js";
import type { ExerciseId } from "../types/identifiers.js";
import type { IExerciseRepository } from "../repositories/ExerciseRepository.js";

type CardioInput = Omit<CardioExercise, "id" | "pace" | "completed" | "finalCaloriesBurned">;
type StrengthInput = Omit<StrengthExercise, "id" | "completed" | "finalWeightLifted">;
type FlexibilityInput = Omit<FlexibilityExercise, "id" | "completed" | "finalCommentsUser">;

export type NewExerciseInput = CardioInput | StrengthInput | FlexibilityInput;

export class ExerciseService {
  private repository: IExerciseRepository;
  private currentId: ExerciseId = 1;

  constructor(repository: IExerciseRepository) {
    this.repository = repository;
  }

  public createExerciseTemplate(data: NewExerciseInput): Exercise {
    const newExercise = this.buildExerciseTemplate(data);
    this.repository.save(newExercise);
    return newExercise;
  }

  public generateExercise(templateId: ExerciseId): Exercise | undefined {
    const template = this.getExerciseTemplate(templateId);
    if (!template) {
      return undefined;
    }
    return structuredClone(template);
  }

  public getExerciseTemplate(id: ExerciseId): Exercise | undefined {
    return this.repository.findById(id);
  }

  public getAllExerciseTemplates(): Exercise[] {
    return this.repository.findAll();
  }

  private buildExerciseTemplate(data: NewExerciseInput): Exercise {
    const id = this.nextId();

    switch (data.category) {
      case ExerciseCategory.CARDIO:
        return { ...data, id, pace: this.calculatePace(data), completed: false, finalCaloriesBurned: 0 };
      case ExerciseCategory.STRENGTH:
        return { ...data, id, completed: false, finalWeightLifted: 0 };
      case ExerciseCategory.FLEXIBILITY:
        return { ...data, id, completed: false, finalCommentsUser: "" };
    }
  }

  private calculatePace(data: CardioInput): number {
    if (data.distance <= 0) {
      return 0;
    }
    const pace = data.duration / data.distance;
    return Number(pace.toFixed(2));
  }

  private nextId(): ExerciseId {
    const id = this.currentId;
    this.currentId += 1;
    return id;
  }
}
