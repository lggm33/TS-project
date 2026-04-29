import type {
  Ejercicio,
  EjercicioCardio,
  EjercicioFuerza,
  EjercicioFlexibilidad,
} from "../types/ejercicio.js";
import { CategoriaEjercicio } from "../types/ejercicio.js";
import type { EjercicioId } from "../types/identificadores.js";
import type { IExerciseRepository } from "../repositories/ExerciseRepository.js";

type CardioInput = Omit<EjercicioCardio, "id" | "ritmo">;
type FuerzaInput = Omit<EjercicioFuerza, "id">;
type FlexibilidadInput = Omit<EjercicioFlexibilidad, "id">;

export type NuevoEjercicioInput = CardioInput | FuerzaInput | FlexibilidadInput;

export class ExerciseService {
  private repository: IExerciseRepository;
  private currentId: EjercicioId = 1;

  constructor(repository: IExerciseRepository) {
    this.repository = repository;
  }

  public createExercise(data: NuevoEjercicioInput): Ejercicio {
    const newExercise = this.buildExercise(data);
    this.repository.save(newExercise);
    return newExercise;
  }

  public getExercise(id: EjercicioId): Ejercicio | undefined {
    return this.repository.findById(id);
  }

  public getAllExercises(): Ejercicio[] {
    return this.repository.findAll();
  }

  private buildExercise(data: NuevoEjercicioInput): Ejercicio {
    const id = this.nextId();

    switch (data.categoria) {
      case CategoriaEjercicio.CARDIO:
        return { ...data, id, ritmo: this.calcularRitmo(data) };
      case CategoriaEjercicio.FUERZA:
        return { ...data, id };
      case CategoriaEjercicio.FLEXIBILIDAD:
        return { ...data, id };
    }
  }

  private calcularRitmo(data: CardioInput): number {
    if (data.distancia_recorrida <= 0) {
      return 0;
    }
    const ritmo = data.duracion / data.distancia_recorrida;
    return Number(ritmo.toFixed(2));
  }

  private nextId(): EjercicioId {
    const id = this.currentId;
    this.currentId += 1;
    return id;
  }
}
