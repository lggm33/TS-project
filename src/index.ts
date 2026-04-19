import { DiaSemana } from "./types/index.js";
import type { Usuario, Ejercicio , Rutina_Diaria, Rutina_Semanal } from "./types/index.js";

const ejercicio1: Ejercicio = {
  id: 1,
  nombre: 'Correr',
  descripcion: 'Correr 10 minutos',
  duracion: 30,
  calorias_por_minuto: 100, 
  distancia: 1000,
};

const ejercicio2: Ejercicio = {
  id: 2,
  nombre: 'Sentadillas',
  descripcion: 'Sentadillas 10 veces',
  duracion: 10,
  calorias_por_minuto: 50,
};

const ejercicio3: Ejercicio = {
  id: 3,
  nombre: 'Plancha',
  descripcion: 'Plancha 10 segundos',
  duracion: 10,
  calorias_por_minuto: 50,
};

const rutina_lunes: Rutina_Diaria = {
  id: 1,
  dia: DiaSemana.LUNES,
  ejercicio: ejercicio1,
};

const rutina_miercoles: Rutina_Diaria = {
  id: 2,
  dia: DiaSemana.MIERCOLES,
  ejercicio: ejercicio2,
};

const rutina_viernes: Rutina_Diaria = {
  id: 3,
  dia: DiaSemana.VIERNES,
  ejercicio: ejercicio3,
};

const rutina_semana: Rutina_Semanal = {
  id: 1,
  plan: {
    [DiaSemana.LUNES]: rutina_lunes,
    [DiaSemana.MIERCOLES]: rutina_miercoles,
    [DiaSemana.VIERNES]: rutina_viernes,
  },
};
const usuario: Usuario = {
  id: 1,
  nombre: 'Juan',
  email: 'juan@example.com',
  edad: 20,
  peso: 70,
  altura: 1.75,
  sexo: 'masculino',
  objetivo: 'perder peso',
  nivel: 'intermedio',
  rutina: rutina_semana,
};

function calcularCalorias(ejercicio: Ejercicio) {
  return ejercicio.calorias_por_minuto * ejercicio.duracion;
}

function calcularRitmo(ejercicio: Ejercicio) {
  if (ejercicio.distancia) {
    return parseInt((ejercicio.distancia / ejercicio.duracion).toFixed(2));
  }
  return null;
}

function calcularCaloriasDiarias(rutina: Rutina_Diaria) {
  return rutina.ejercicio.calorias_por_minuto * rutina.ejercicio.duracion;
}

function calcularCaloriasSemanales(rutina: Rutina_Semanal): number {
  return Object.values(rutina.plan)
    .filter((dia): dia is Rutina_Diaria => dia !== undefined)
    .map(calcularCaloriasDiarias)
    .reduce((total, actual) => total + actual, 0);
}

function duracionFormateada(duracion: number): string {
  const horas = Math.floor(duracion / 60);
  const minutos = duracion % 60;
  if (horas > 0) {
    return `${horas}h ${minutos}min`;
  }
  return `${minutos}min`;
}

function EstadisticasEjercicio(ejercicio: Ejercicio): string {
  return `
    Ejercicio: ${ejercicio.nombre}
    Descripción: ${ejercicio.descripcion}
    Duración: ${duracionFormateada(ejercicio.duracion)}
    Calorías por minuto: ${ejercicio.calorias_por_minuto}
    Calorías totales: ${calcularCalorias(ejercicio)}kcal
    Duración total: ${duracionFormateada(ejercicio.duracion)}
    ${ejercicio.distancia ? `Distancia: ${ejercicio.distancia}km` : ''}
    ${ejercicio.distancia ? `Ritmo: ${calcularRitmo(ejercicio)}km/h` : ''}
  `;
}

function obtenerDiaMayorGasto(rutina: Rutina_Semanal): { dia: string; calorias: number } | null {
  const entradas = Object.entries(rutina.plan).filter(([, r]) => r !== undefined) as [string, Rutina_Diaria][];
  
  if (entradas.length === 0) return null;

  return entradas.reduce((max, [dia, r]) => {
    const calorias = calcularCaloriasDiarias(r);
    return calorias > max.calorias ? { dia, calorias } : max;
  }, { dia: '', calorias: -1 });
}

function ImprimirUsuario(usuario: Usuario): void {
  const { nombre, edad, rutina, nivel } = usuario;
  const plan = rutina.plan;
  const diasEntrenados = Object.entries(plan).filter(([, r]) => r !== undefined);
  const totalCalorias = calcularCaloriasSemanales(rutina);
  const promedioCalorias = diasEntrenados.length > 0 ? Math.round(totalCalorias / diasEntrenados.length) : 0;
  const diaTop = obtenerDiaMayorGasto(rutina);

  console.log(`👤 Perfil de Usuario
══════════════════════════════════
   Nombre: ${nombre}
   Edad: ${edad}
   Nivel: ${nivel}
   Objetivo: ${usuario.objetivo}

📋 Rutina Semanal: ${rutina.id === 1 ? 'Full Body Plan' : 'Plan Personalizado'}
──────────────────────────────────`);

  const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  diasEntrenados.forEach(([dia, r]) => {
    if (r) {
      const e = r.ejercicio;
      const cal = calcularCaloriasDiarias(r);
      const tiempo = e.duracion >= 60 ? `${Math.floor(e.duracion / 60)}h` : `${e.duracion}min`;
      console.log(`   ${capitalizar(dia).padEnd(10)}: ${e.nombre.padEnd(10)} - ${tiempo.padEnd(6)} (${cal} cal)`);
    }
  });

  console.log(`──────────────────────────────────
   Total semanal:      ${totalCalorias} cal
   Promedio por día:   ${promedioCalorias} cal (${diasEntrenados.length} días entrenados)
   ${diaTop ? `Día más intenso:    ${capitalizar(diaTop.dia)} (${diaTop.calorias} cal)` : ''}
══════════════════════════════════`);
}

ImprimirUsuario(usuario);