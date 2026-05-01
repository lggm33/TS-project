import type {
  Usuario,
  DatosPersonales,
  Membresia,
} from "../types/usuario.js";
import type { UsuarioId, RutinaId } from "../types/identificadores.js";
import type { IUserRepository } from "../repositories/UserRepository.js";

export interface NuevoUsuarioInput {
  personal: DatosPersonales;
  membresia: Membresia;
}

export class UserService {
  private repository: IUserRepository;
  private currentId: UsuarioId = 1;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  public createUser(data: NuevoUsuarioInput): Usuario {
    const id = this.nextId();
    const newUser: Usuario = {
      id,
      personal: data.personal,
      membresia: data.membresia,
      rutina: {
        id: this.buildRutinaId(),
        plan: {},
      },
    };
    this.repository.save(newUser);
    return newUser;
  }

  public getUser(id: UsuarioId): Usuario | undefined {
    return this.repository.findById(id);
  }

  public getAllUsers(): Usuario[] {
    return this.repository.findAll();
  }

  public updateUser(user: Usuario): void {
    this.repository.update(user);
  }

  private nextId(): UsuarioId {
    const id = this.currentId;
    this.currentId += 1;
    return id;
  }

  private buildRutinaId(): RutinaId {
    return Date.now();
  }
}
