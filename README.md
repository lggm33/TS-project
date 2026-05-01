# Routine Management CLI

A command-line interface (CLI) application to manage users, exercises, and fitness routines for the FitTracker domain. Built with TypeScript and Node.js.

## Architecture

The project follows SOLID and DRY principles, organized into four main layers:

1. **Types Layer (`src/types`)**: Domain types including the discriminated union for `Ejercicio` (cardio / fuerza / flexibilidad), the composite `Usuario` (personal data + membership), routine types, and shared identifier aliases (`EjercicioId`, `UsuarioId`, `RutinaId`).
2. **Data Layer (`src/repositories`)**: In-memory storage for users and exercises. Data is reset upon application restart.
3. **Service Layer (`src/services`)**: Business logic — `UserService`, `ExerciseService` (derives `ritmo` automatically for cardio), `RoutineService`.
4. **Presentation Layer (`src/cli`)**: Interactive prompts using `@inquirer/prompts`, plus presenters for the user profile and the category-grouped catalog.

### Exercise categories

The `Ejercicio` type is a discriminated union with three variants. Each one has its own properties and the TypeScript compiler rejects accessing fields that do not belong to a given category:

- **Cardio** (`categoria: 'cardio'`): `distancia_recorrida` (km), `ritmo` (min/km, derived), `zona_frecuencia_cardiaca`.
- **Fuerza** (`categoria: 'fuerza'`): `series`, `repeticiones`, `peso` (kg).
- **Flexibilidad** (`categoria: 'flexibilidad'`): `numero_poses`.

The CLI flow asks for the category first and then only requests the fields that belong to it; an invalid combination cannot be constructed.

### User profile

A `Usuario` is composed by combining two grouped objects:

- `personal`: `nombre`, `email`, `edad`, `peso`, `altura`, `sexo`, `objetivo`, `nivel` (literal: `principiante` | `intermedio` | `avanzado`).
- `membresia`: `plan` (literal: `free` | `basic` | `premium`), `fecha_inicio`, `activa`.

## Prerequisites

- Node.js
- npm

## Installation

Install dependencies:

```bash
npm install
```

## Usage

To run the interactive CLI:

```bash
npm run cli
```

This command will compile the TypeScript code and start the interactive menu.

### Available scripts

- `npm run build` — Compile the TypeScript code to JavaScript.
- `npm run cli` — Compile and run the interactive CLI menu.
- `npm start` — Run the compiled JavaScript code from the `dist` folder.

### Menu options

- **Agregar Usuario** — Create a user (personal data + membership).
- **Agregar Ejercicio** — Choose category, then provide only the fields that match.
- **Crear Rutina** — Assign an exercise to a user's day of the week.
- **Ver Perfil** — Display the user's full profile (personal, membership, weekly routine).
- **Ver Catálogo** — Show the catalog grouped by category, with subtotals of minutes and calories per type.
- **Ver Contadores por Categoría** — Bonus: show only the count per category.

## Expected catalog output

```
📊 Catálogo de Ejercicios ══════════════════════════════════
🏃 Cardio (2 ejercicios, 105 min, 1008 kcal)
   Running, 45 min | 5.2 km | Ritmo: 8.65 min/km | 468 kcal
   Cycling, 60 min | 20.0 km | Ritmo: 3.00 min/km | 540 kcal
💪 Fuerza (1 ejercicio, 30 min, 300 kcal)
   Bench Press, 4 series x 10 reps | 60 kg | 300 kcal
🧘 Flexibilidad (1 ejercicio, 40 min, 160 kcal)
   Yoga Flow, 12 poses | 160 kcal
──────────────────────────────────
Total: 4 ejercicios
══════════════════════════════════
──────────────────────────────────
👤 Usuario: Ana García, Nivel: intermediate | Membresía: premium
══════════════════════════════════
```
