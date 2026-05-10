import { z } from "zod";

const MuscleGroupOptions = [
  { name: "Abdominales",      value: "abdominals"  },
  { name: "Abductores",       value: "abductors"   },
  { name: "Aductores",        value: "adductors"   },
  { name: "Bíceps",           value: "biceps"      },
  { name: "Pantorrillas",     value: "calves"      },
  { name: "Pecho",            value: "chest"       },
  { name: "Antebrazos",       value: "forearms"    },
  { name: "Glúteos",          value: "glutes"      },
  { name: "Isquiotibiales",   value: "hamstrings"  },
  { name: "Dorsales",         value: "lats"        },
  { name: "Lumbar",           value: "lower_back"  },
  { name: "Espalda media",    value: "middle_back" },
  { name: "Cuello",           value: "neck"        },
  { name: "Cuádriceps",       value: "quadriceps"  },
  { name: "Trapecios",        value: "traps"       },
  { name: "Tríceps",          value: "triceps"     },
] as const;

const ApiDifficultyLabel: Record<string, string> = {
  beginner:     "Principiante",
  intermediate: "Intermedio",
  expert:       "Experto",
};

const ApiNinjasExerciseSchema = z.object({
  name:        z.string().min(1),
  type:        z.string().min(1),
  muscle:      z.string().min(1),
  difficulty:  z.enum(["beginner", "intermediate", "expert"]),
  instructions: z.string(),
  equipments:  z.array(z.string()),
  safety_info: z.string(),
});

type ApiNinjasExercise = z.infer<typeof ApiNinjasExerciseSchema>;

export { ApiNinjasExerciseSchema, MuscleGroupOptions, ApiDifficultyLabel };
export type { ApiNinjasExercise };
