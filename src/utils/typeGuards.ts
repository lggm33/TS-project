import type { User, Student, Trainer } from "../types/user.js";

function isStudent(user: User): user is Student {
  return 'routine' in user;
}

function isTrainer(user: User): user is Trainer {
  return 'users_assigned' in user;
}

export { isStudent, isTrainer };
