import type { Exercise } from "../types/exercise.js";
import type { User, UserLevelType } from "../types/user.js";
import type { CategorySummary } from "../utils/calculations.js";
import {
  groupByCategory,
  sumByCategory,
  countByCategory,
} from "../utils/calculations.js";
import {
  describeExercise,
  getCategoryLabel,
} from "../utils/exerciseFormatters.js";

const USER_LEVEL_DISPLAY: Readonly<Record<UserLevelType, string>> = {
  principiante: 'beginner',
  intermedio: 'intermediate',
  avanzado: 'advanced',
};

const TOP_SEPARATOR = '══════════════════════════════════';
const INNER_SEPARATOR = '──────────────────────────────────';

export class CatalogPresenter {
  public static printCatalog(exercises: Exercise[]): void {
    console.log(`\n📊 Catálogo de Ejercicios ${TOP_SEPARATOR}`);

    if (exercises.length === 0) {
      console.log('   (sin ejercicios registrados)');
      console.log(TOP_SEPARATOR);
      return;
    }

    const groups = groupByCategory(exercises);
    const totals = sumByCategory(exercises);

    CatalogPresenter.printGroup(groups.cardio, totals.cardio);
    CatalogPresenter.printGroup(groups.strength, totals.strength);
    CatalogPresenter.printGroup(groups.flexibility, totals.flexibility);

    console.log(INNER_SEPARATOR);
    console.log(`Total: ${exercises.length} ejercicios`);
    console.log(TOP_SEPARATOR);
  }

  public static printCategoryCounters(exercises: Exercise[]): void {
    const counters = countByCategory(exercises);
    console.log(`\n📊 Contadores por Categoría ${TOP_SEPARATOR}`);
    console.log(`   🏃 Cardio:        ${counters.cardio}`);
    console.log(`   💪 Fuerza:        ${counters.strength}`);
    console.log(`   🧘 Flexibilidad:  ${counters.flexibility}`);
    console.log(`${INNER_SEPARATOR}`);
    console.log(`Total: ${exercises.length} ejercicios`);
    console.log(`${TOP_SEPARATOR}\n`);
  }

  private static printGroup(group: Exercise[], summary: CategorySummary): void {
    if (group.length === 0) {
      return;
    }

    const firstExercise = group[0];
    if (firstExercise === undefined) {
      return;
    }

    const { emoji, label } = getCategoryLabel(firstExercise.category);
    const exerciseWord = summary.count === 1 ? 'ejercicio' : 'ejercicios';
    console.log(
      `${emoji} ${label} (${summary.count} ${exerciseWord}, ${summary.minutes} min, ${summary.calories} kcal)`,
    );

    for (const exercise of group) {
      console.log(`   ${describeExercise(exercise)}`);
    }
  }
}
