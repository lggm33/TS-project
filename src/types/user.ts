import type { WeeklyRoutine } from "./routine.js";
import type { UserId } from "./identifiers.js";

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

interface PersonalData {
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  gender: 'masculino' | 'femenino';
  goal: 'perder peso' | 'ganar peso' | 'mantener peso';
  level: UserLevelType;
}

interface Membership {
  plan: MembershipPlanType;
  startDate: Date;
  active: boolean;
}

interface User {
  id: UserId;
  personal: PersonalData;
  membership: Membership;
  routine: WeeklyRoutine;
}

export { UserLevel, MembershipPlan };
export type {
  User,
  PersonalData,
  Membership,
  UserLevelType,
  MembershipPlanType,
};
