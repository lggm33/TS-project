import type { WeeklyRoutine } from "./routine.js";
import type { UserId} from "./identifiers.js";

const UserLevel = {
  BEGINNER: 'principiante',
  INTERMEDIATE: 'intermedio',
  ADVANCED: 'avanzado',
} as const;

type UserLevelType = (typeof UserLevel)[keyof typeof UserLevel];

const MembershipPlan = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
} as const;

type MembershipPlanType = (typeof MembershipPlan)[keyof typeof MembershipPlan];

type UserType = 'student' | 'trainer';

interface PersonalData {
  name: string;
  age: number;
  email: string;
  gender: 'masculino' | 'femenino';
  type: UserType;
}

interface StudentData extends PersonalData {
  weight: number;
  height: number;
  goal: 'perder peso' | 'ganar peso' | 'mantener peso';
  level: UserLevelType;
}

interface Membership {
  plan: MembershipPlanType;
  startDate: Date;
  active: boolean;
}

interface Student {
  id: UserId;
  personal: StudentData;
  membership: Membership;
  routine: WeeklyRoutine;
}

interface Trainer {
  id: UserId;
  personal: PersonalData;
  users_assigned: UserId[];
}

type User = Student | Trainer;

export { UserLevel, MembershipPlan };
export type {
  Student,
  StudentData,
  Trainer,
  PersonalData,
  Membership,
  UserLevelType,
  MembershipPlanType,
  UserType,
  User
};
