import { select, input, confirm } from "@inquirer/prompts";
import type { UserService } from "../services/UserService.js";
import type { ExerciseService, NewExerciseInput } from "../services/ExerciseService.js";
import type { RoutineService } from "../services/RoutineService.js";
import { WeekDay } from "../types/routine.js";
import type { WeekDayType } from "../types/routine.js";
import type {
  PersonalData,
  Membership,
  UserLevelType,
  MembershipPlanType,
} from "../types/user.js";
import { ExerciseCategory } from "../types/exercise.js";
import type { ExerciseCategoryType } from "../types/exercise.js";
import { ProfilePresenter } from "./ProfilePresenter.js";
import { CatalogPresenter } from "./CatalogPresenter.js";

type Gender = PersonalData["gender"];
type Goal = PersonalData["goal"];

export class MenuController {
  private userService: UserService;
  private exerciseService: ExerciseService;
  private routineService: RoutineService;

  constructor(
    userService: UserService,
    exerciseService: ExerciseService,
    routineService: RoutineService,
  ) {
    this.userService = userService;
    this.exerciseService = exerciseService;
    this.routineService = routineService;
  }

  public async startMenu(): Promise<void> {
    let exit = false;

    while (!exit) {
      const option = await select({
        message: "Seleccione una opción",
        choices: [
          { name: "Agregar Usuario", value: "add_user" },
          { name: "Agregar Ejercicio", value: "add_exercise" },
          { name: "Crear Rutina", value: "create_routine" },
          { name: "Ver Perfil", value: "view_profile" },
          { name: "Ver Catálogo", value: "view_catalog" },
          { name: "Ver Contadores por Categoría", value: "view_counters" },
          { name: "Salir", value: "exit" },
        ],
      });

      switch (option) {
        case "add_user":
          await this.addUserPrompt();
          break;
        case "add_exercise":
          await this.addExercisePrompt();
          break;
        case "create_routine":
          await this.createRoutinePrompt();
          break;
        case "view_profile":
          await this.viewProfilePrompt();
          break;
        case "view_catalog":
          await this.viewCatalogPrompt();
          break;
        case "view_counters":
          this.viewCountersPrompt();
          break;
        case "exit":
          exit = true;
          console.log("¡Hasta luego!");
          break;
      }
    }
  }

  private async addUserPrompt(): Promise<void> {
    const personal = await this.collectPersonalData();
    const membership = await this.collectMembershipData();

    const newUser = this.userService.createUser({ personal, membership });
    console.log(`✅ Usuario ${newUser.personal.name} creado con éxito.`);
  }

  private async addExercisePrompt(): Promise<void> {
    const name = await input({ message: "Nombre del ejercicio:" });
    const duration = await this.askPositiveNumber("Duración (minutos):");
    const caloriesPerMinute = await this.askPositiveNumber("Calorías por minuto:");

    const category = await select<ExerciseCategoryType>({
      message: "Categoría del ejercicio:",
      choices: [
        { name: "🏃 Cardio", value: ExerciseCategory.CARDIO },
        { name: "💪 Fuerza", value: ExerciseCategory.STRENGTH },
        { name: "🧘 Flexibilidad", value: ExerciseCategory.FLEXIBILITY },
      ],
    });

    const exerciseInput = await this.collectExerciseSpecificData(
      category,
      { name, duration, caloriesPerMinute },
    );

    const newExercise = this.exerciseService.createExercise(exerciseInput);
    console.log(`✅ Ejercicio ${newExercise.name} (${newExercise.category}) creado con éxito.`);
  }

  private async createRoutinePrompt(): Promise<void> {
    const users = this.userService.getAllUsers();
    if (users.length === 0) {
      console.log("❌ No hay usuarios registrados. Agregue un usuario primero.");
      return;
    }

    const exercises = this.exerciseService.getAllExercises();
    if (exercises.length === 0) {
      console.log("❌ No hay ejercicios registrados. Agregue un ejercicio primero.");
      return;
    }

    const userId = await select({
      message: "Seleccione un usuario:",
      choices: users.map((u) => ({ name: u.personal.name, value: u.id })),
    });

    const exerciseId = await select({
      message: "Seleccione un ejercicio:",
      choices: exercises.map((e) => ({
        name: `${e.name} (${e.category})`,
        value: e.id,
      })),
    });

    const day = await select<WeekDayType>({
      message: "Seleccione el día de la semana:",
      choices: Object.values(WeekDay).map((d) => ({ name: d, value: d })),
    });

    const success = this.routineService.addExerciseToRoutine(userId, exerciseId, day);

    if (success) {
      console.log(`✅ Ejercicio asignado a la rutina del día ${day} con éxito.`);
    } else {
      console.log("❌ Error al asignar el ejercicio.");
    }
  }

  private async viewProfilePrompt(): Promise<void> {
    const users = this.userService.getAllUsers();
    if (users.length === 0) {
      console.log("❌ No hay usuarios registrados.");
      return;
    }

    const userId = await select({
      message: "Seleccione un usuario:",
      choices: users.map((u) => ({ name: u.personal.name, value: u.id })),
    });

    const user = this.userService.getUser(userId);
    if (user !== undefined) {
      ProfilePresenter.printUserProfile(user);
    }
  }

  private async viewCatalogPrompt(): Promise<void> {
    const exercises = this.exerciseService.getAllExercises();
    const users = this.userService.getAllUsers();

    if (users.length === 0) {
      CatalogPresenter.printCatalog(exercises);
      return;
    }
    CatalogPresenter.printCatalog(exercises);
  }

  private viewCountersPrompt(): void {
    const exercises = this.exerciseService.getAllExercises();
    CatalogPresenter.printCategoryCounters(exercises);
  }

  private async collectPersonalData(): Promise<PersonalData> {
    const name = await input({ message: "Nombre del usuario:" });
    const email = await input({ message: "Email del usuario:" });
    const age = await this.askPositiveNumber("Edad:");
    const weight = await this.askPositiveNumber("Peso (kg):");
    const height = await this.askPositiveNumber("Altura (m):");

    const gender = await select<Gender>({
      message: "Sexo:",
      choices: [
        { name: "Masculino", value: "masculino" },
        { name: "Femenino", value: "femenino" },
      ],
    });

    const goal = await select<Goal>({
      message: "Objetivo:",
      choices: [
        { name: "Perder peso", value: "perder peso" },
        { name: "Ganar peso", value: "ganar peso" },
        { name: "Mantener peso", value: "mantener peso" },
      ],
    });

    const level = await select<UserLevelType>({
      message: "Nivel:",
      choices: [
        { name: "Principiante", value: "principiante" },
        { name: "Intermedio", value: "intermedio" },
        { name: "Avanzado", value: "avanzado" },
      ],
    });

    return { name, email, age, weight, height, gender, goal, level };
  }

  private async collectMembershipData(): Promise<Membership> {
    const plan = await select<MembershipPlanType>({
      message: "Plan de membresía:",
      choices: [
        { name: "Free", value: "free" },
        { name: "Basic", value: "basic" },
        { name: "Premium", value: "premium" },
      ],
    });

    const startDateStr = await input({
      message: "Fecha de inicio (YYYY-MM-DD):",
      default: new Date().toISOString().slice(0, 10),
      validate: (val) => MenuController.isValidIsoDate(val) || "Debe ser una fecha válida YYYY-MM-DD",
    });
    const startDate = new Date(startDateStr);

    const active = await confirm({ message: "¿Membresía activa?", default: true });

    return { plan, startDate, active };
  }

  private async collectExerciseSpecificData(
    category: ExerciseCategoryType,
    common: { name: string; duration: number; caloriesPerMinute: number },
  ): Promise<NewExerciseInput> {
    switch (category) {
      case ExerciseCategory.CARDIO: {
        const distance = await this.askPositiveNumber("Distancia recorrida (km):");
        const heartRateZone = await this.askPositiveNumber("Zona de frecuencia cardíaca (1-5):");
        return {
          ...common,
          category: ExerciseCategory.CARDIO,
          distance,
          heartRateZone,
        };
      }
      case ExerciseCategory.STRENGTH: {
        const sets = await this.askPositiveNumber("Series:");
        const reps = await this.askPositiveNumber("Repeticiones por serie:");
        const weight = await this.askPositiveNumber("Peso (kg):");
        return {
          ...common,
          category: ExerciseCategory.STRENGTH,
          sets,
          reps,
          weight,
        };
      }
      case ExerciseCategory.FLEXIBILITY: {
        const poses = await this.askPositiveNumber("Número de poses:");
        return {
          ...common,
          category: ExerciseCategory.FLEXIBILITY,
          poses,
        };
      }
    }
  }

  private async askPositiveNumber(message: string): Promise<number> {
    const value = await input({
      message,
      validate: (val) => {
        const n = Number(val);
        return (!isNaN(n) && n >= 0) || "Debe ser un número válido (>= 0)";
      },
    });
    return Number(value);
  }

  private static isValidIsoDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
}
