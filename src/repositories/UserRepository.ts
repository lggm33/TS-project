import type { Usuario } from "../types/usuario.js";

export interface IUserRepository {
  save(user: Usuario): void;
  findById(id: number): Usuario | undefined;
  findAll(): Usuario[];
  update(user: Usuario): void;
}

export class InMemoryUserRepository implements IUserRepository {
  private users: Usuario[] = [];

  public save(user: Usuario): void {
    this.users.push(user);
  }

  public findById(id: number): Usuario | undefined {
    return this.users.find(u => u.id === id);
  }

  public findAll(): Usuario[] {
    return [...this.users];
  }

  public update(user: Usuario): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }
}
