import type { Ejercicio } from "../types/ejercicio.js";

export interface IExerciseRepository {
  save(exercise: Ejercicio): void;
  findById(id: number): Ejercicio | undefined;
  findAll(): Ejercicio[];
}

export class InMemoryExerciseRepository implements IExerciseRepository {
  private exercises: Ejercicio[] = [];

  public save(exercise: Ejercicio): void {
    this.exercises.push(exercise);
  }

  public findById(id: number): Ejercicio | undefined {
    return this.exercises.find(e => e.id === id);
  }

  public findAll(): Ejercicio[] {
    return [...this.exercises];
  }
}
