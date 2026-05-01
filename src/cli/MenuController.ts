import { select, input, confirm } from "@inquirer/prompts";
import type { UserService } from "../services/UserService.js";
import type { ExerciseService, NuevoEjercicioInput } from "../services/ExerciseService.js";
import type { RoutineService } from "../services/RoutineService.js";
import { DiaSemana } from "../types/rutina.js";
import type { DiaSemanaType } from "../types/rutina.js";
import type {
  DatosPersonales,
  Membresia,
  NivelUsuarioType,
  PlanMembresiaType,
} from "../types/usuario.js";
import { CategoriaEjercicio } from "../types/ejercicio.js";
import type { CategoriaEjercicioType } from "../types/ejercicio.js";
import { ProfilePresenter } from "./ProfilePresenter.js";
import { CatalogPresenter } from "./CatalogPresenter.js";

type Sexo = DatosPersonales["sexo"];
type Objetivo = DatosPersonales["objetivo"];

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
    const membresia = await this.collectMembresiaData();

    const newUser = this.userService.createUser({ personal, membresia });
    console.log(`✅ Usuario ${newUser.personal.nombre} creado con éxito.`);
  }

  private async addExercisePrompt(): Promise<void> {
    const nombre = await input({ message: "Nombre del ejercicio:" });
    const duracion = await this.askPositiveNumber("Duración (minutos):");
    const calorias_por_minuto = await this.askPositiveNumber("Calorías por minuto:");

    const categoria = await select<CategoriaEjercicioType>({
      message: "Categoría del ejercicio:",
      choices: [
        { name: "🏃 Cardio", value: CategoriaEjercicio.CARDIO },
        { name: "💪 Fuerza", value: CategoriaEjercicio.FUERZA },
        { name: "🧘 Flexibilidad", value: CategoriaEjercicio.FLEXIBILIDAD },
      ],
    });

    const exerciseInput = await this.collectExerciseSpecificData(
      categoria,
      { nombre, duracion, calorias_por_minuto },
    );

    const newExercise = this.exerciseService.createExercise(exerciseInput);
    console.log(`✅ Ejercicio ${newExercise.nombre} (${newExercise.categoria}) creado con éxito.`);
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
      choices: users.map((u) => ({ name: u.personal.nombre, value: u.id })),
    });

    const exerciseId = await select({
      message: "Seleccione un ejercicio:",
      choices: exercises.map((e) => ({
        name: `${e.nombre} (${e.categoria})`,
        value: e.id,
      })),
    });

    const day = await select<DiaSemanaType>({
      message: "Seleccione el día de la semana:",
      choices: Object.values(DiaSemana).map((d) => ({ name: d, value: d })),
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
      choices: users.map((u) => ({ name: u.personal.nombre, value: u.id })),
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

  private async collectPersonalData(): Promise<DatosPersonales> {
    const nombre = await input({ message: "Nombre del usuario:" });
    const email = await input({ message: "Email del usuario:" });
    const edad = await this.askPositiveNumber("Edad:");
    const peso = await this.askPositiveNumber("Peso (kg):");
    const altura = await this.askPositiveNumber("Altura (m):");

    const sexo = await select<Sexo>({
      message: "Sexo:",
      choices: [
        { name: "Masculino", value: "masculino" },
        { name: "Femenino", value: "femenino" },
      ],
    });

    const objetivo = await select<Objetivo>({
      message: "Objetivo:",
      choices: [
        { name: "Perder peso", value: "perder peso" },
        { name: "Ganar peso", value: "ganar peso" },
        { name: "Mantener peso", value: "mantener peso" },
      ],
    });

    const nivel = await select<NivelUsuarioType>({
      message: "Nivel:",
      choices: [
        { name: "Principiante", value: "principiante" },
        { name: "Intermedio", value: "intermedio" },
        { name: "Avanzado", value: "avanzado" },
      ],
    });

    return { nombre, email, edad, peso, altura, sexo, objetivo, nivel };
  }

  private async collectMembresiaData(): Promise<Membresia> {
    const plan = await select<PlanMembresiaType>({
      message: "Plan de membresía:",
      choices: [
        { name: "Free", value: "free" },
        { name: "Basic", value: "basic" },
        { name: "Premium", value: "premium" },
      ],
    });

    const fechaInicioStr = await input({
      message: "Fecha de inicio (YYYY-MM-DD):",
      default: new Date().toISOString().slice(0, 10),
      validate: (val) => MenuController.isValidIsoDate(val) || "Debe ser una fecha válida YYYY-MM-DD",
    });
    const fecha_inicio = new Date(fechaInicioStr);

    const activa = await confirm({ message: "¿Membresía activa?", default: true });

    return { plan, fecha_inicio, activa };
  }

  private async collectExerciseSpecificData(
    categoria: CategoriaEjercicioType,
    common: { nombre: string; duracion: number; calorias_por_minuto: number },
  ): Promise<NuevoEjercicioInput> {
    switch (categoria) {
      case CategoriaEjercicio.CARDIO: {
        const distancia_recorrida = await this.askPositiveNumber("Distancia recorrida (km):");
        const zona_frecuencia_cardiaca = await this.askPositiveNumber("Zona de frecuencia cardíaca (1-5):");
        return {
          ...common,
          categoria: CategoriaEjercicio.CARDIO,
          distancia_recorrida,
          zona_frecuencia_cardiaca,
        };
      }
      case CategoriaEjercicio.FUERZA: {
        const series = await this.askPositiveNumber("Series:");
        const repeticiones = await this.askPositiveNumber("Repeticiones por serie:");
        const peso = await this.askPositiveNumber("Peso (kg):");
        return {
          ...common,
          categoria: CategoriaEjercicio.FUERZA,
          series,
          repeticiones,
          peso,
        };
      }
      case CategoriaEjercicio.FLEXIBILIDAD: {
        const numero_poses = await this.askPositiveNumber("Número de poses:");
        return {
          ...common,
          categoria: CategoriaEjercicio.FLEXIBILIDAD,
          numero_poses,
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
