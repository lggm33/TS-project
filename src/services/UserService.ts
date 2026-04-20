import type { Usuario } from "../types/usuario.js";
import type { IUserRepository } from "../repositories/UserRepository.js";

export class UserService {
  private repository: IUserRepository;
  private currentId: number = 1;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  public createUser(data: Omit<Usuario, "id" | "rutina">): Usuario {
    const newUser: Usuario = {
      ...data,
      id: this.currentId++,
      rutina: {
        id: Date.now(),
        plan: {}
      }
    };
    this.repository.save(newUser);
    return newUser;
  }

  public getUser(id: number): Usuario | undefined {
    return this.repository.findById(id);
  }

  public getAllUsers(): Usuario[] {
    return this.repository.findAll();
  }

  public updateUser(user: Usuario): void {
    this.repository.update(user);
  }
}
