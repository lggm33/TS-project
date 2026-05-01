import type { UserService } from "./UserService.js";
import type { ExerciseService } from "./ExerciseService.js";
import type { WeekDayType, DailyRoutine } from "../types/routine.js";
import type { UserId, ExerciseId, RoutineId } from "../types/identifiers.js";

export class RoutineService {
  private userService: UserService;
  private exerciseService: ExerciseService;
  private currentRoutineId: RoutineId = 1;

  constructor(userService: UserService, exerciseService: ExerciseService) {
    this.userService = userService;
    this.exerciseService = exerciseService;
  }

  public addExerciseToRoutine(
    userId: UserId,
    exerciseId: ExerciseId,
    day: WeekDayType,
  ): boolean {
    const user = this.userService.getUser(userId);
    const exercise = this.exerciseService.getExercise(exerciseId);

    if (!user || !exercise) {
      return false;
    }

    const dailyRoutine: DailyRoutine = {
      id: this.nextRoutineId(),
      day: day,
      exercise: exercise,
    };

    user.routine.plan[day] = dailyRoutine;
    this.userService.updateUser(user);

    return true;
  }

  private nextRoutineId(): RoutineId {
    const id = this.currentRoutineId;
    this.currentRoutineId += 1;
    return id;
  }
}
