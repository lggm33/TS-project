import type {
  Student,
  Trainer,
  Membership,
  StudentData,
  PersonalData,
  User,
  UserType,
} from "../types/user.js";
import type { UserId, RoutineId } from "../types/identifiers.js";
import type { IUserRepository } from "../repositories/UserRepository.js";

export interface NewStudentInput {
  personal: StudentData;
  membership: Membership;
  type: 'student';
  routine_name: string;
}

export interface NewTrainerInput {
  personal: PersonalData;
  type: 'trainer';
}

export class UserService {
  private repository: IUserRepository;
  private currentId: UserId = 1;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  public createStudent(data: NewStudentInput): Student {
    const id = this.nextId();
    const newUser: Student = {
      id,
      personal: { ...data.personal, type: data.type },
      membership: data.membership,
      routine: {
        id: this.buildRoutineId(),
        start_date: new Date(),
        plan: {},
        rutine_name: data.routine_name,
      },
    };
    this.repository.save(newUser);
    return newUser;
  }

  public createTrainer(data: NewTrainerInput): Trainer {
    const id = this.nextId();
    const newUser: Trainer = {
      id,
      personal: { ...data.personal, type: data.type },
      users_assigned: [],
    };
    this.repository.save(newUser);
    return newUser;
  }

  public assignUserToTrainer(trainerId: UserId, userId: UserId): boolean {
    const trainer = this.getUser(trainerId);
    const user = this.getUser(userId);
    if (!trainer || !user) {
      return false;
    }
    if (trainer?.personal.type != 'trainer') {
      return false;
    }
    if (!('users_assigned' in trainer)) {
      return false;
    }
    trainer.users_assigned.push(userId);
    this.updateUser(trainer);
    return true;
  }

  public getUser(id: UserId): User | undefined {
    const user = this.repository.findById(id);
    if (!user) {
      return undefined;
    }
    if (user.personal.type === 'student') {
      return user as Student;
    }
    return user as Trainer;
  }

  public getAllUsers(type?: UserType): User[] {
    const users = this.repository.findAll();
    if (type === 'student') {
      return users.filter((u): u is Student => u.personal.type === 'student');
    }
    if (type === 'trainer') {
      return users.filter((u): u is Trainer => u.personal.type === 'trainer');
    }
    return users;
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
