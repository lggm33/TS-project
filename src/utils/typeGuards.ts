import type { User, Student, Trainer } from "../types/index.js";

function isStudent(user: User): user is Student {
  return 'routine' in user;
}

function isTrainer(user: User): user is Trainer {
  return 'users_assigned' in user;
}

function hasStringName(value: unknown): value is { name: string } {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("name" in value)) {
    return false;
  }
  return typeof value.name === "string";
}

function getRawName(value: unknown): string {
  if (!hasStringName(value)) {
    return "Sin nombre";
  }
  return value.name;
}

export { isStudent, isTrainer, hasStringName, getRawName };
