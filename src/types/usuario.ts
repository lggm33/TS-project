import type { Rutina_Semanal } from "./rutina.js";
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  peso: number;
  altura: number;
  sexo: 'masculino' | 'femenino';
  objetivo: 'perder peso' | 'ganar peso' | 'mantener peso';
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  rutina: Rutina_Semanal;
}

export type { Usuario };