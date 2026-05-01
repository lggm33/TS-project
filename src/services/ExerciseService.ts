import type {
  Exercise,
  CardioExercise,
  StrengthExercise,
  FlexibilityExercise,
} from "../types/exercise.js";
import { ExerciseCategory } from "../types/exercise.js";
import type { ExerciseId } from "../types/identifiers.js";
import type { IExerciseRepository } from "../repositories/ExerciseRepository.js";

type CardioInput = Omit<CardioExercise, "id" | "pace">;
type StrengthInput = Omit<StrengthExercise, "id">;
type FlexibilityInput = Omit<FlexibilityExercise, "id">;

export type NewExerciseInput = CardioInput | StrengthInput | FlexibilityInput;

export class ExerciseService {
  private repository: IExerciseRepository;
  private currentId: ExerciseId = 1;

  constructor(repository: IExerciseRepository) {
    this.repository = repository;
  }

  public createExercise(data: NewExerciseInput): Exercise {
    const newExercise = this.buildExercise(data);
    this.repository.save(newExercise);
    return newExercise;
  }

  public getExercise(id: ExerciseId): Exercise | undefined {
    return this.repository.findById(id);
  }

  public getAllExercises(): Exercise[] {
    return this.repository.findAll();
  }

  private buildExercise(data: NewExerciseInput): Exercise {
    const id = this.nextId();

    switch (data.category) {
      case ExerciseCategory.CARDIO:
        return { ...data, id, pace: this.calculatePace(data) };
      case ExerciseCategory.STRENGTH:
        return { ...data, id };
      case ExerciseCategory.FLEXIBILITY:
        return { ...data, id };
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
