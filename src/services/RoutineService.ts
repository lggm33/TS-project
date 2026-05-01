import type { UserService } from "./UserService.js";
import type { ExerciseService } from "./ExerciseService.js";
import type { DiaSemanaType, Rutina_Diaria } from "../types/rutina.js";
import type { UsuarioId, EjercicioId, RutinaId } from "../types/identificadores.js";

export class RoutineService {
  private userService: UserService;
  private exerciseService: ExerciseService;
  private currentRoutineId: RutinaId = 1;

  constructor(userService: UserService, exerciseService: ExerciseService) {
    this.userService = userService;
    this.exerciseService = exerciseService;
  }

  public addExerciseToRoutine(
    userId: UsuarioId,
    exerciseId: EjercicioId,
    day: DiaSemanaType,
  ): boolean {
    const user = this.userService.getUser(userId);
    const exercise = this.exerciseService.getExercise(exerciseId);

    if (!user || !exercise) {
      return false;
    }

    const rutinaDiaria: Rutina_Diaria = {
      id: this.nextRoutineId(),
      dia: day,
      ejercicio: exercise,
    };

    user.rutina.plan[day] = rutinaDiaria;
    this.userService.updateUser(user);

    return true;
  }

  private nextRoutineId(): RutinaId {
    const id = this.currentRoutineId;
    this.currentRoutineId += 1;
    return id;
  }
}
