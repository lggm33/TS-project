import type { Rutina_Semanal } from "./rutina.js";
import type { UsuarioId } from "./identificadores.js";

const NivelUsuario = {
  PRINCIPIANTE: 'principiante',
  INTERMEDIO: 'intermedio',
  AVANZADO: 'avanzado',
} as const;

type NivelUsuarioType = (typeof NivelUsuario)[keyof typeof NivelUsuario];

const PlanMembresia = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
} as const;

type PlanMembresiaType = (typeof PlanMembresia)[keyof typeof PlanMembresia];

interface DatosPersonales {
  nombre: string;
  email: string;
  edad: number;
  peso: number;
  altura: number;
  sexo: 'masculino' | 'femenino';
  objetivo: 'perder peso' | 'ganar peso' | 'mantener peso';
  nivel: NivelUsuarioType;
}

interface Membresia {
  plan: PlanMembresiaType;
  fecha_inicio: Date;
  activa: boolean;
}

interface Usuario {
  id: UsuarioId;
  personal: DatosPersonales;
  membresia: Membresia;
  rutina: Rutina_Semanal;
}

export { NivelUsuario, PlanMembresia };
export type {
  Usuario,
  DatosPersonales,
  Membresia,
  NivelUsuarioType,
  PlanMembresiaType,
};
