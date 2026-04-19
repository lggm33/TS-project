import type { Ejercicio } from "./ejercicio.js";

interface Rutina_Diaria {
  id: number;
  dia: string;
  ejercicio: Ejercicio;
}

const DiaSemana = {
  LUNES: 'lunes',
  MARTES: 'martes',
  MIERCOLES: 'miercoles',
  JUEVES: 'jueves',
  VIERNES: 'viernes',
  SABADO: 'sabado',
  DOMINGO: 'domingo',
} as const;

type DiaSemanaType = (typeof DiaSemana)[keyof typeof DiaSemana];

interface Rutina_Semanal {
  id: number;
  plan: Partial<Record<DiaSemanaType, Rutina_Diaria>>;
}

export { DiaSemana };
export type { Rutina_Diaria, Rutina_Semanal, DiaSemanaType };