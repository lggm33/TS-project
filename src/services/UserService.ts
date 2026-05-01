import type {
  User,
  PersonalData,
  Membership,
} from "../types/user.js";
import type { UserId, RoutineId } from "../types/identifiers.js";
import type { IUserRepository } from "../repositories/UserRepository.js";

export interface NewUserInput {
  personal: PersonalData;
  membership: Membership;
}

export class UserService {
  private repository: IUserRepository;
  private currentId: UserId = 1;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  public createUser(data: NewUserInput): User {
    const id = this.nextId();
    const newUser: User = {
      id,
      personal: data.personal,
      membership: data.membership,
      routine: {
        id: this.buildRoutineId(),
        plan: {},
      },
    };
    this.repository.save(newUser);
    return newUser;
  }

  public getUser(id: UserId): User | undefined {
    return this.repository.findById(id);
  }

  public getAllUsers(): User[] {
    return this.repository.findAll();
  }

  public updateUser(user: User): void {
    this.repository.update(user);
  }

  private nextId(): UserId {
    const id = this.currentId;
    this.currentId += 1;
    return id;
  }

  private buildRoutineId(): RoutineId {
    return Date.now();
  }
}
