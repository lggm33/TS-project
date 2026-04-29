import type { Usuario } from "../types/usuario.js";
import type { UsuarioId } from "../types/identificadores.js";

export interface IUserRepository {
  save(user: Usuario): void;
  findById(id: UsuarioId): Usuario | undefined;
  findAll(): Usuario[];
  update(user: Usuario): void;
}

export class InMemoryUserRepository implements IUserRepository {
  private users: Usuario[] = [];

  public save(user: Usuario): void {
    this.users.push(user);
  }

  public findById(id: UsuarioId): Usuario | undefined {
    return this.users.find((u) => u.id === id);
  }

  public findAll(): Usuario[] {
    return [...this.users];
  }

  public update(user: Usuario): void {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }
}
