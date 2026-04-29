import type { Ejercicio } from "../types/ejercicio.js";
import type { Usuario, NivelUsuarioType } from "../types/usuario.js";
import type { CategorySummary } from "../utils/calculations.js";
import {
  agruparPorCategoria,
  sumarPorCategoria,
  contarPorCategoria,
} from "../utils/calculations.js";
import {
  describirEjercicio,
  obtenerEtiquetaCategoria,
} from "../utils/exerciseFormatters.js";

const NIVEL_USUARIO_DISPLAY: Readonly<Record<NivelUsuarioType, string>> = {
  principiante: 'beginner',
  intermedio: 'intermediate',
  avanzado: 'advanced',
};

const SEPARADOR_TOP = '══════════════════════════════════';
const SEPARADOR_INNER = '──────────────────────────────────';

export class CatalogPresenter {
  public static printCatalog(exercises: Ejercicio[]): void {
    console.log(`\n📊 Catálogo de Ejercicios ${SEPARADOR_TOP}`);

    if (exercises.length === 0) {
      console.log('   (sin ejercicios registrados)');
      console.log(SEPARADOR_TOP);
      return;
    }

    const groups = agruparPorCategoria(exercises);
    const totals = sumarPorCategoria(exercises);

    CatalogPresenter.printGroup(groups.cardio, totals.cardio);
    CatalogPresenter.printGroup(groups.fuerza, totals.fuerza);
    CatalogPresenter.printGroup(groups.flexibilidad, totals.flexibilidad);

    console.log(SEPARADOR_INNER);
    console.log(`Total: ${exercises.length} ejercicios`);
    console.log(SEPARADOR_TOP);
  }

  public static printCategoryCounters(exercises: Ejercicio[]): void {
    const counters = contarPorCategoria(exercises);
    console.log(`\n📊 Contadores por Categoría ${SEPARADOR_TOP}`);
    console.log(`   🏃 Cardio:        ${counters.cardio}`);
    console.log(`   💪 Fuerza:        ${counters.fuerza}`);
    console.log(`   🧘 Flexibilidad:  ${counters.flexibilidad}`);
    console.log(`${SEPARADOR_INNER}`);
    console.log(`Total: ${exercises.length} ejercicios`);
    console.log(`${SEPARADOR_TOP}\n`);
  }

  private static printGroup(group: Ejercicio[], summary: CategorySummary): void {
    if (group.length === 0) {
      return;
    }

    const firstExercise = group[0];
    if (firstExercise === undefined) {
      return;
    }

    const { emoji, label } = obtenerEtiquetaCategoria(firstExercise.categoria);
    const ejercicioWord = summary.count === 1 ? 'ejercicio' : 'ejercicios';
    console.log(
      `${emoji} ${label} (${summary.count} ${ejercicioWord}, ${summary.minutos} min, ${summary.calorias} kcal)`,
    );

    for (const exercise of group) {
      console.log(`   ${describirEjercicio(exercise)}`);
    }
  }
}
