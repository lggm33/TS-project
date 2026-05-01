import { InMemoryUserRepository } from "./repositories/UserRepository.js";
import { InMemoryExerciseRepository } from "./repositories/ExerciseRepository.js";
import { UserService } from "./services/UserService.js";
import { ExerciseService } from "./services/ExerciseService.js";
import { RoutineService } from "./services/RoutineService.js";
import { MenuController } from "./cli/MenuController.js";

async function main(): Promise<void> {
  const userRepository = new InMemoryUserRepository();
  const exerciseRepository = new InMemoryExerciseRepository();

  const userService = new UserService(userRepository);
  const exerciseService = new ExerciseService(exerciseRepository);
  const routineService = new RoutineService(userService, exerciseService);

  const menuController = new MenuController(userService, exerciseService, routineService);

  console.log("¡Bienvenido a la App de Gestión de Rutinas!");
  await menuController.startMenu();
}

main().catch((error) => {
  console.error("Ocurrió un error:", error);
});
