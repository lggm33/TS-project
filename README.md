# TypeScript Workout Project 🏋️‍♂️

Este proyecto es una aplicación de gestión de rutinas de entrenamiento desarrollada en TypeScript, diseñada para demostrar principios de **SDD (Spec-Driven Development)**, **SOLID** y **DRY**.

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- Node.js instalado.
- npm (Node Package Manager).

### Instalación
1. Clona o descarga el proyecto.
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

### Comandos de ejecución

#### Modo Desarrollo (Recomendado)
Para ejecutar el código directamente sin generar archivos compilados y ver los resultados en la terminal:
```bash
npx tsx src/index.ts
```

#### Compilación y Ejecución Tradicional
Si prefieres compilar el proyecto a JavaScript:
1. Compilar el código:
   ```bash
   npm run build
   ```
2. Ejecutar el código compilado:
   ```bash
   node dist/index.js
   ```

## 📂 Estructura del Proyecto

- `src/index.ts`: Punto de entrada principal con la lógica de usuario y rutinas.
- `src/types/`: Definiciones de tipos e interfaces del sistema.
  - `ejercicio.ts`: Estructura de los ejercicios.
  - `rutina.ts`: Lógica de días de la semana y planes.
  - `usuario.ts`: Perfil del usuario con restricciones de nivel.
- `dist/`: Carpeta generada con el código JavaScript compilado.

## ✨ Características implementadas
- **Type Safety**: Uso de `as const`, `Partial`, `Record` y tipos mapeados.
- **Cálculos Automáticos**: Calorías diarias, semanales y promedios.
- **Validaciones**: Niveles de usuario restringidos (principiante, intermedio, avanzado).
- **Reportes**: Formato visual limpio en consola para el perfil de usuario.
