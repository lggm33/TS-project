import type { Exercise } from "./exercise.js";
import type { RoutineId } from "./identifiers.js";

interface DailyRoutine {
  id: RoutineId;
  day: string;
  exercise: Exercise;
}

const WeekDay = {
  MONDAY: 'lunes',
  TUESDAY: 'martes',
  WEDNESDAY: 'miercoles',
  THURSDAY: 'jueves',
  FRIDAY: 'viernes',
  SATURDAY: 'sabado',
  SUNDAY: 'domingo',
} as const;

type WeekDayType = (typeof WeekDay)[keyof typeof WeekDay];

interface WeeklyRoutine {
  id: RoutineId;
  plan: Partial<Record<WeekDayType, DailyRoutine>>;
}

export { WeekDay };
export type { DailyRoutine, WeeklyRoutine, WeekDayType };
