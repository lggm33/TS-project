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
  UserType,
  User,
  Student,
  Trainer,
  StudentData
} from "../types/user.js";
import { ExerciseCategory } from "../types/exercise.js";
import type { ExerciseCategoryType } from "../types/exercise.js";
import { ProfilePresenter } from "./ProfilePresenter.js";
import { CatalogPresenter } from "./CatalogPresenter.js";
import { formatDuration, capitalizeString } from "../utils/formatters.js";

type Gender = PersonalData["gender"];
type Goal = StudentData["goal"];

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

      const options = await select({
        message: "Bienvenido a la App de Gestión de Rutinas",
        choices: [
          { name: "Iniciar sesión", value: "login" },
          { name: "Registrarse", value: "register" },
          { name: "Salir", value: "exit" },
        ],
      });

      switch (options) {
        case "login":
          await this.loginPrompt();
          break;
          case "register":
            await this.registerPrompt();
            break;
          case "exit":
            exit = true;
            console.log("\n¡Hasta luego!\n");
            break;
      }
    }
  }

  private async loginPrompt(): Promise<void> {
    const chooseUserType = await select({
      message: "Seleccione el tipo de usuario:",
      choices: [
        { name: "Estudiante", value: "student" },
        { name: "Entrenador", value: "trainer" },
      ],
    });
    switch (chooseUserType) {
      case "student":
        await this.studentLoginPrompt();
        break;
      case "trainer":
        await this.trainerLoginPrompt();
        break;
    }
  }

  private async registerPrompt(): Promise<void> {
    console.log("Registro de usuarios\n");
    const basePersonalData = await this.collectBasePersonalDataPrompt();

    switch (basePersonalData.type) {
      case "student":
        const studentPersonalData = await this.collectStudentPersonalData(basePersonalData);
        const membership = await this.collectMembershipData();
        const routineName = await input({ message: "Nombre de la rutina:" });
        const student = this.userService.createStudent({ 
          personal: studentPersonalData,
          membership, 
          type: "student",
          routine_name: routineName,
        });
        console.log(`\n✅ Usuario ${student.personal.name} creado con éxito.\n`);
        await this.studentMenu(student);
        break;
      case "trainer":
        const trainer = this.userService.createTrainer({ 
          personal: basePersonalData, 
          type: "trainer" });
        console.log(`\n✅ Usuario ${trainer.personal.name} creado con éxito.\n`);
        await this.trainerMenu(trainer);
        break;
    }
  }

  private async collectBasePersonalDataPrompt(): Promise<PersonalData> {
    const type = await select<UserType>({
      message: "Seleccione el tipo de usuario:",
      choices: [
        { name: "Estudiante", value: "student" },
        { name: "Entrenador", value: "trainer" },
      ],
    });
    const name = await input({ message: "Nombre del usuario:" });
    const age = await this.askPositiveNumber("Edad:");
    const email = await input({ message: "Email del usuario:" });
    
    const gender = await select<Gender>({
      message: "Sexo:",
      choices: [
        { name: "Masculino", value: "masculino" },
        { name: "Femenino", value: "femenino" },
      ],
    });

    return { name, age, email, gender, type };
  }

  private async studentLoginPrompt(): Promise<void> {
    const students = this.userService.getAllUsers("student");
    if (students.length === 0) {
      console.log("❌ No hay estudiantes registrados.");
      console.log("Primero debe registrarse como estudiante.");
      console.log("================================================ \n");
      await this.registerPrompt();
      return;
    }
    const studentId = await select({
      message: "Seleccione su perfil:",
      choices: students.map((s) => ({ name: s.personal.name, value: s.id })),
    });

    const student = this.userService.getStudent(studentId);
    if (!student) {
      console.log("❌ Estudiante no encontrado.");
      return;
    }
    await this.studentMenu(student);
  }

  private async trainerLoginPrompt(): Promise<void> {
    const trainers = this.userService.getAllUsers("trainer");
    if (trainers.length === 0) {
      console.log("❌ No hay entrenadores registrados.");
      console.log("Primero debe registrarse como entrenador.");
      await this.registerPrompt();
      return;
    }
    const trainerId = await select({
      message: "Seleccione su perfil:",
      choices: trainers.map((t) => ({ name: t.personal.name, value: t.id })),
    });

    const trainer = this.userService.getTrainer(trainerId);
    if (!trainer) {
      console.log("❌ Entrenador no encontrado.");
      return;
    }
    await this.trainerMenu(trainer);
  }
  
  private async studentMenu(student: Student): Promise<void> {

    console.log(`\n👋 Bienvenido ${student.personal.name}!`);
    let exit = false;
    while (!exit) {
      const options = await select({
        message: "¿Qué desea hacer?",
        choices: [
          { name: "Ver perfil", value: "view_profile" },
          { name: "Manejar rutina", value: "manage_routine" },
          { name: "Agregar ejercicio", value: "add_exercise" },
          { name: "Cerrar sesión", value: "exit" },
        ],
      });

      switch (options) {
        case "view_profile":
          await ProfilePresenter.printStudenProfile(student);
          break;
        case "manage_routine":
          await this.manageRoutinePrompt(student);
          break;
        case "add_exercise":
          await this.addExercisePrompt(student);
          break;
        case "exit":
          exit = true;
          console.log("\n¡Cerrando sesión...\n");
          break;
      }
    }
  }

  private async trainerMenu(trainer: Trainer): Promise<void> {
    console.log(`\n👋 Bienvenido ${trainer.personal.name}!`);
    let exit = false;
    while (!exit) {
      const options = await select({
        message: "¿Qué desea hacer?",
        choices: [
          { name: "Ver perfil y usuarios asignados", value: "view_profile_and_users_assigned" },
          { name: "Crear ejercicio", value: "create_exercise" },
          { name: "Cerrar sesión", value: "exit" },
        ],
      });

      switch (options) {
        case "view_profile_and_users_assigned":
          await ProfilePresenter.printTrainerProfile(trainer, this.userService);
          break;
        case "create_exercise":
          await this.createExercisePrompt();
          break;
        case "exit":
          exit = true;
          console.log("\n¡Cerrando sesión...\n");
          break;
      }
    }
  }

  private async createExercisePrompt(): Promise<void> {
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

    const newExercise = this.exerciseService.createExerciseTemplate(exerciseInput);
    console.log(`\n✅ Ejercicio ${newExercise.name} (${newExercise.category}) creado con éxito.\n`);
  }

  private async addExercisePrompt(student: Student): Promise<void> {
    const exercises = this.exerciseService.getAllExerciseTemplates();
    if (exercises.length === 0) {
      console.log("❌ No hay ejercicios registrados. Pidele a un entrenador que te cree uno.");
      return;
    }
    
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

    const success = this.routineService.addExerciseToRoutine(student.id, exerciseId, day);

    if (success) {
      console.log(`\n✅ Ejercicio asignado a la rutina del día ${day} con éxito.\n`);
    } else {
      console.log("\n❌ Error al asignar el ejercicio.\n");
    }
  }

  private async manageRoutinePrompt(student: Student): Promise<void> {
    const days = Object.values(WeekDay)
      .filter((day) => {
        const daily = student.routine.plan[day];
        return daily !== undefined && daily.exercises.length > 0;
      })
      .map((day) => ({ name: capitalizeString(day), value: day }));

    if (days.length === 0) {
      console.log("❌ No tienes días con ejercicios en tu rutina.");
      return;
    }

    let exit = false;
    while (!exit) {
      const selectedDay = await select<WeekDayType | "back">({
        message: "Seleccione un día para gestionar:",
        choices: [...days, { name: "⬅️ Volver", value: "back" }],
      });

      if (selectedDay === "back") {
        exit = true;
        continue;
      }

      let dailyRoutine = student.routine.plan[selectedDay]!;
      
      let backDay = false;
      while (!backDay) {
        const action = await select({
          message: `Gestionando el día ${capitalizeString(selectedDay)}:`,
          choices: [
            { name: "Marcar ejercicios completados", value: "exercises" },
            { name: "Dejar/Editar comentario del día", value: "comment" },
            { name: "⬅️ Volver", value: "back" },
          ],
        });

        switch (action) {
          case "back":
            backDay = true;
            break;
            
          case "comment": {
            const currentComment = dailyRoutine.comments || "";
            console.log(`Comentario actual: ${currentComment ? currentComment : "(Ninguno)"}`);
            const newComment = await input({ message: "Nuevo comentario:" });
            
            const updatedStudent = {
              ...student,
              routine: {
                ...student.routine,
                plan: {
                  ...student.routine.plan,
                  [selectedDay]: {
                    ...dailyRoutine,
                    comments: newComment,
                  }
                }
              }
            };
            this.userService.updateUser(updatedStudent);
            student = updatedStudent;
            dailyRoutine = student.routine.plan[selectedDay]!;
            console.log("\n✅ Comentario guardado.\n");
            break;
          }
            
          case "exercises": {
            const exerciseChoices = dailyRoutine.exercises.map((ex, index) => ({
              name: `${ex.completed ? '✅' : '❌'} ${ex.name} [${ex.category}]`,
              value: index,
            }));

            const exIndex = await select({
              message: "Seleccione un ejercicio para cambiar su estado:",
              choices: [...exerciseChoices, { name: "⬅️ Volver", value: -1 }],
            });

            if (exIndex !== -1) {
              const ex = dailyRoutine.exercises[exIndex];
              if (!ex) break;

              const isCompleted = await confirm({
                message: `¿Marcar "${ex.name}" como completado?`,
                default: ex.completed,
              });
              
              const updatedEx = { ...ex, completed: isCompleted };
              
              if (isCompleted) {
                 if (updatedEx.category === 'fuerza') {
                   const weight = await this.askPositiveNumber(`Peso final levantado (kg) [Sugerido: ${updatedEx.weight}]:`);
                   updatedEx.finalWeightLifted = weight;
                 } else if (updatedEx.category === 'cardio') {
                   const cals = await this.askPositiveNumber(`Calorías finales quemadas [Sugeridas: ${updatedEx.caloriesPerMinute * updatedEx.duration}]:`);
                   updatedEx.finalCaloriesBurned = cals;
                 }
              }

              const updatedExercises = [...dailyRoutine.exercises];
              updatedExercises[exIndex] = updatedEx;

              const updatedStudent = {
                ...student,
                routine: {
                  ...student.routine,
                  plan: {
                    ...student.routine.plan,
                    [selectedDay]: {
                      ...dailyRoutine,
                      exercises: updatedExercises,
                    }
                  }
                }
              };

              this.userService.updateUser(updatedStudent);
              student = updatedStudent;
              dailyRoutine = student.routine.plan[selectedDay]!;
              console.log("\n✅ Estado del ejercicio actualizado.\n");
            }
            break;
          }
        }
      }
    }
  }

  private async collectStudentPersonalData(basePersonalData: PersonalData): Promise<StudentData> {
    const weight = await this.askPositiveNumber("Peso (kg):");
    const height = await this.askPositiveNumber("Altura (m):");

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
    })

    return { ...basePersonalData, weight, height, goal, level };
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
