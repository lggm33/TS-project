import type { Ejercicio } from "../types/ejercicio.js";
import type { IExerciseRepository } from "../repositories/ExerciseRepository.js";

export class ExerciseService {
  private repository: IExerciseRepository;
  private currentId: number = 1;

  constructor(repository: IExerciseRepository) {
    this.repository = repository;
  }

  public createExercise(data: Omit<Ejercicio, "id">): Ejercicio {
    const newExercise: Ejercicio = {
      ...data,
      id: this.currentId++
    };
    this.repository.save(newExercise);
    return newExercise;
  }

  public getExercise(id: number): Ejercicio | undefined {
    return this.repository.findById(id);
  }

  public getAllExercises(): Ejercicio[] {
    return this.repository.findAll();
  }
}
