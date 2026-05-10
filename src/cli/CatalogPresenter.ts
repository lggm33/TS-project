import type { Exercise } from "../types/exercise.js";
import type { UserLevelType } from "../types/user.js";
import type { CategorySummary } from "../utils/calculations.js";
import type { InvalidExercise } from "../services/ExerciseService.js";
import {
  groupByCategory,
  sumByCategory,
  countByCategory,
} from "../utils/calculations.js";
import {
  describeExercise,
  describeExerciseReport,
  getCategoryLabel,
} from "../utils/exerciseFormatters.js";
import { getRawName } from "../utils/typeGuards.js";

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

  public static printUnifiedReport(exercises: Exercise[], invalidExercises: InvalidExercise[]): void {
    const groups = groupByCategory(exercises);
    const totalMinutes = exercises.reduce((sum, ex) => sum + ex.duration, 0);

    console.log(`\n📊 Reporte por Tipo de Ejercicio`);
    console.log(TOP_SEPARATOR);

    CatalogPresenter.printReportGroup('🏃', 'Cardio', groups.cardio);
    CatalogPresenter.printReportGroup('💪', 'Fuerza', groups.strength);
    CatalogPresenter.printReportGroup('🧘', 'Flexibilidad', groups.flexibility);

    console.log(INNER_SEPARATOR);
    console.log(`Total: ${exercises.length} ejercicios, ${totalMinutes} min`);

    if (invalidExercises.length > 0) {
      console.log(`\n⚠️  Ejercicios con datos incompletos (${invalidExercises.length}):`);
      for (const item of invalidExercises) {
        const name = getRawName(item.raw);
        console.log(`   ${name}, ${item.reason}`);
      }
    }

    console.log(TOP_SEPARATOR);
  }

  private static printReportGroup(emoji: string, label: string, group: Exercise[]): void {
    if (group.length === 0) {
      return;
    }

    const exerciseWord = group.length === 1 ? 'ejercicio' : 'ejercicios';
    console.log(`${emoji} ${label} (${group.length} ${exerciseWord})`);

    for (const exercise of group) {
      console.log(`   ${describeExerciseReport(exercise)}`);
    }
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
