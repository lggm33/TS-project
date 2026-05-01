import type { User } from "../types/user.js";
import type { UserId } from "../types/identifiers.js";

export interface IUserRepository {
  save(user: User): void;
  findById(id: UserId): User | undefined;
  findAll(): User[];
  update(user: User): void;
}

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  public save(user: User): void {
    this.users.push(user);
  }

  public findById(id: UserId): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public findAll(): User[] {
    return [...this.users];
  }

  public update(user: User): void {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }
}
