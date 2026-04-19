interface Ejercicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  calorias_por_minuto: number;
  distancia?: number;
}

export type { Ejercicio };