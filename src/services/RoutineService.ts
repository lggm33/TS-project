import type { UserService } from "./UserService.js";
import type { ExerciseService } from "./ExerciseService.js";
import type { DiaSemanaType, Rutina_Diaria } from "../types/rutina.js";

export class RoutineService {
  private userService: UserService;
  private exerciseService: ExerciseService;
  private currentRoutineId: number = 1;

  constructor(userService: UserService, exerciseService: ExerciseService) {
    this.userService = userService;
    this.exerciseService = exerciseService;
  }

  public addExerciseToRoutine(userId: number, exerciseId: number, day: DiaSemanaType): boolean {
    const user = this.userService.getUser(userId);
    const exercise = this.exerciseService.getExercise(exerciseId);

    if (!user || !exercise) {
      return false;
    }

    const rutinaDiaria: Rutina_Diaria = {
      id: this.currentRoutineId++,
      dia: day,
      ejercicio: exercise
    };

    user.rutina.plan[day] = rutinaDiaria;
    this.userService.updateUser(user);

    return true;
  }
}
