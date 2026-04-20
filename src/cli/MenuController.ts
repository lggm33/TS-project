import { select, input } from "@inquirer/prompts";
import type { UserService } from "../services/UserService.js";
import type { ExerciseService } from "../services/ExerciseService.js";
import type { RoutineService } from "../services/RoutineService.js";
import { DiaSemana } from "../types/rutina.js";
import type { DiaSemanaType } from "../types/rutina.js";
import type { Usuario } from "../types/usuario.js";
import type { Ejercicio } from "../types/ejercicio.js";
import { ProfilePresenter } from "./ProfilePresenter.js"; // We need to move ImprimirUsuario to a utils file or similar, or export it.

export class MenuController {
  private userService: UserService;
  private exerciseService: ExerciseService;
  private routineService: RoutineService;

  constructor(
    userService: UserService,
    exerciseService: ExerciseService,
    routineService: RoutineService
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
          { name: "Salir", value: "exit" }
        ]
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
        case "exit":
          exit = true;
          console.log("¡Hasta luego!");
          break;
      }
    }
  }

  private async addUserPrompt(): Promise<void> {
    const nombre = await input({ message: "Nombre del usuario:" });
    const email = await input({ message: "Email del usuario:" });
    const edadStr = await input({ message: "Edad:", validate: (val) => !isNaN(Number(val)) || "Debe ser un número" });
    const edad = Number(edadStr);
    
    const pesoStr = await input({ message: "Peso (kg):", validate: (val) => !isNaN(Number(val)) || "Debe ser un número" });
    const peso = Number(pesoStr);
    
    const alturaStr = await input({ message: "Altura (m):", validate: (val) => !isNaN(Number(val)) || "Debe ser un número" });
    const altura = Number(alturaStr);
    
    const sexo = await select({
      message: "Sexo:",
      choices: [
        { name: "Masculino", value: "masculino" },
        { name: "Femenino", value: "femenino" }
      ]
    }) as 'masculino' | 'femenino';

    const objetivo = await select({
      message: "Objetivo:",
      choices: [
        { name: "Perder peso", value: "perder peso" },
        { name: "Ganar peso", value: "ganar peso" },
        { name: "Mantener peso", value: "mantener peso" }
      ]
    }) as 'perder peso' | 'ganar peso' | 'mantener peso';

    const nivel = await select({
      message: "Nivel:",
      choices: [
        { name: "Principiante", value: "principiante" },
        { name: "Intermedio", value: "intermedio" },
        { name: "Avanzado", value: "avanzado" }
      ]
    }) as 'principiante' | 'intermedio' | 'avanzado';

    const newUser = this.userService.createUser({
      nombre,
      email,
      edad,
      peso,
      altura,
      sexo,
      objetivo,
      nivel
    });

    console.log(`✅ Usuario ${newUser.nombre} creado con éxito.`);
  }

  private async addExercisePrompt(): Promise<void> {
    const nombre = await input({ message: "Nombre del ejercicio:" });
    const descripcion = await input({ message: "Descripción:" });
    const duracionStr = await input({ message: "Duración (minutos):", validate: (val) => !isNaN(Number(val)) || "Debe ser un número" });
    const duracion = Number(duracionStr);
    
    const caloriasStr = await input({ message: "Calorías por minuto:", validate: (val) => !isNaN(Number(val)) || "Debe ser un número" });
    const calorias_por_minuto = Number(caloriasStr);
    
    const hasDistancia = await select({
      message: "¿Tiene distancia?",
      choices: [
        { name: "Sí", value: true },
        { name: "No", value: false }
      ]
    });

    let distancia: number | undefined = undefined;
    if (hasDistancia) {
      const distStr = await input({ message: "Distancia (metros):", validate: (val) => !isNaN(Number(val)) || "Debe ser un número" });
      distancia = Number(distStr);
    }

    const exerciseData: Omit<Ejercicio, "id"> = {
      nombre,
      descripcion,
      duracion,
      calorias_por_minuto
    };

    if (distancia !== undefined) {
      exerciseData.distancia = distancia;
    }

    const newExercise = this.exerciseService.createExercise(exerciseData);

    console.log(`✅ Ejercicio ${newExercise.nombre} creado con éxito.`);
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
      choices: users.map(u => ({ name: u.nombre, value: u.id }))
    });

    const exerciseId = await select({
      message: "Seleccione un ejercicio:",
      choices: exercises.map(e => ({ name: e.nombre, value: e.id }))
    });

    const day = await select({
      message: "Seleccione el día de la semana:",
      choices: Object.values(DiaSemana).map(d => ({ name: d, value: d }))
    });

    const success = this.routineService.addExerciseToRoutine(userId, exerciseId, day as DiaSemanaType);
    
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
      choices: users.map(u => ({ name: u.nombre, value: u.id }))
    });

    const user = this.userService.getUser(userId);
    if (user !== undefined) {
      ProfilePresenter.printUserProfile(user);
    }
  }
}
