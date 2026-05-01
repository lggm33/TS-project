import type { Exercise } from "../types/exercise.js";
import type { ExerciseId } from "../types/identifiers.js";

export interface IExerciseRepository {
  save(exercise: Exercise): void;
  findById(id: ExerciseId): Exercise | undefined;
  findAll(): Exercise[];
}

export class InMemoryExerciseRepository implements IExerciseRepository {
  private exercises: Exercise[] = [];

  public save(exercise: Exercise): void {
    this.exercises.push(exercise);
  }

  public findById(id: ExerciseId): Exercise | undefined {
    return this.exercises.find((e) => e.id === id);
  }

  public findAll(): Exercise[] {
    return [...this.exercises];
  }
}
