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
    const exercise = this.exerciseService.generateExercise(exerciseId);

    if (!user || !exercise) {
      return false;
    }

    if (user?.personal.type != 'student') {
      return false;
    }
    if (!('routine' in user)) {
      return false;
    }

    const currentPlan = user.routine.plan;
    const dailyRoutine = currentPlan[day] || {
      id: this.nextRoutineId(),
      day: day,
      exercises: [],
    };

    const updatedUser = {
      ...user,
      routine: {
        ...user.routine,
        plan: {
          ...currentPlan,
          [day]: {
            ...dailyRoutine,
            exercises: [...dailyRoutine.exercises, exercise],
          }
        }
      }
    };

    this.userService.updateUser(updatedUser);

    return true;
  }

  private nextRoutineId(): RoutineId {
    const id = this.currentRoutineId;
    this.currentRoutineId += 1;
    return id;
  }
}
