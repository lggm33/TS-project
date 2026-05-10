# Routine Management CLI

A command-line interface (CLI) application to manage users, exercises, and fitness routines for the FitTracker domain. Built with TypeScript and Node.js. Includes integration with the [api-ninjas exercises API](https://api-ninjas.com/api/exercises) to fetch exercises from an external source.

## Features

- **Two user roles**: students (own a routine) and trainers (manage students and the exercise catalog).
- **Discriminated exercise model**: each exercise belongs to one of three categories — `cardio`, `fuerza`, or `flexibilidad` — and only the relevant fields are accessible per category, enforced by the compiler.
- **Workout state machine**: each exercise inside a routine carries one of three statuses — `pendiente`, `completado`, `saltado` — typed as a literal union.
- **External search by muscle group**: trainers can query api-ninjas for exercises by muscle and decide which ones to add to the local catalog.
- **Validation pipeline with Zod**: external exercises are parsed against a strict schema; anything that fails is surfaced to the user as "datos incompletos" instead of being silently dropped or accepted.
- **Unified report**: combines local exercises and exercises imported from the API, grouped by category, with invalid entries reported separately.
- **Graceful network failure**: if the external API is unreachable or returns an error, the user is informed and the local catalog keeps working.

## Architecture

The project follows SOLID and DRY principles, organized into the following layers:

1. **Types Layer (`src/types`)**
   - `exercise.ts` — discriminated union `Exercise = CardioExercise | StrengthExercise | FlexibilityExercise`, plus the `WorkoutStatus` literal union.
   - `external.ts` — Zod schema `ApiNinjasExerciseSchema` describing the raw shape returned by the external API.
   - `user.ts`, `routine.ts`, `identifiers.ts` — supporting domain types.
2. **Repository Layer (`src/repositories`)** — In-memory storage for users and exercises. Data is reset on restart.
3. **Service Layer (`src/services`)**
   - `UserService` — student and trainer management, assignment.
   - `ExerciseService` — local catalog operations, external search orchestration, validation with Zod, and accumulation of invalid items across the session.
   - `RoutineService` — assigning exercises to specific days of a student's routine.
4. **Client Layer (`src/clients`)** — `ExerciseApiClient`, thin HTTP wrapper around api-ninjas. Reads the API key from `process.env.API_NINJAS_KEY`; no secret is hardcoded.
5. **Presentation Layer (`src/cli`)** — Interactive prompts via `@inquirer/prompts`. Includes `MenuController`, `ProfilePresenter`, and `CatalogPresenter` (catalog, counters, unified report).
6. **Utilities (`src/utils`)**
   - `assertions.ts` — `assertNever` helper used in switch defaults to enforce exhaustive handling of discriminated unions at compile time.
   - `typeGuards.ts` — runtime guards for `Student`/`Trainer` plus the safe `getRawName` helper used when displaying invalid external entries.
   - `calculations.ts`, `exerciseFormatters.ts`, `formatters.ts` — domain math and presentation helpers.

### Type safety guarantees

- **No `as` casts** are used in the source (only `as const` for literal maps).
- **No `any`** appears anywhere in `src/`.
- **Exhaustive switches** over `Exercise["category"]` and `WorkoutStatusType` use `assertNever` so adding a new variant produces a compile error at every consumer.
- **External data crosses the boundary through Zod**, never via type assertion.

### Exercise categories

The `Exercise` type is a discriminated union; the compiler rejects accessing fields that do not belong to the active variant:

- **Cardio** (`category: 'cardio'`): `distance` (km), `pace` (min/km, derived), `heartRateZone`, `finalCaloriesBurned`.
- **Fuerza** (`category: 'fuerza'`): `sets`, `reps`, `weight` (kg), `finalWeightLifted`.
- **Flexibilidad** (`category: 'flexibilidad'`): `poses`, `finalCommentsUser`.

All variants share `id`, `name`, `duration`, `caloriesPerMinute`, and `status: WorkoutStatusType`.

## Prerequisites

- Node.js 20+ (uses native `--env-file` flag and `fetch`).
- npm.
- An API key from [api-ninjas.com](https://api-ninjas.com/) (free tier works).

## Installation

```bash
npm install
```

## Environment variables

Create a `.env` file at the project root (already excluded from git via `.gitignore`):

```
API_NINJAS_KEY=your_api_key_here
```

If the key is missing, the app still runs — it simply disables the external search feature and warns at startup. The local catalog stays fully usable.

## Usage

```bash
npm run cli
```

This compiles the TypeScript code and starts the interactive menu.

### Available scripts

- `npm run build` — compile the TypeScript code to `dist/`.
- `npm run cli` — compile and run the interactive CLI.
- `npm start` — run the previously compiled output from `dist/`.

### Menu structure

Top-level prompt:

- **Iniciar sesión** — log in as an existing student or trainer (seed data provides one of each).
- **Registrarse** — create a new student or trainer.
- **Salir**.

Once logged in as a **student**:

- Ver perfil.
- Manejar rutina (cambiar estado de ejercicios por día, dejar comentarios).
- Agregar ejercicio a la rutina.
- Cerrar sesión.

Once logged in as a **trainer**:

- Ver perfil y usuarios asignados.
- Asignar estudiante.
- Crear ejercicio.
- Buscar ejercicios externos (por grupo muscular, vía api-ninjas).
- Generar reporte unificado.
- Cerrar sesión.

### External search flow

1. Trainer picks a target category and a muscle group from a curated list.
2. The service calls api-ninjas with `?muscle=<value>` and reads up to five results (also enforced client-side via a defensive `slice`).
3. Each raw item is validated against `ApiNinjasExerciseSchema`.
4. Valid items are presented for selection; the trainer fills in the local-specific data (duration, calories per minute, category-specific fields) for each one.
5. Invalid items are listed in the search summary and accumulated for the unified report.

## Expected outputs

### Search summary

```
📊 Resultados de búsqueda, muscle: back
══════════════════════════════════
✅ Agregados al catálogo (4)
   Barbell Row    , fuerza      | validado
   Pull-up        , fuerza      | validado
   Seated Row     , fuerza      | validado
   Lat Pulldown   , fuerza      | validado
⚠️  Datos incompletos (1)
   Cable Row      , campos requeridos faltantes
Catálogo local: 4 ejercicios | Desde API: 4 ejercicios
══════════════════════════════════
```

### Unified report

```
📊 Reporte por Tipo de Ejercicio
══════════════════════════════════
🏃 Cardio (2 ejercicios)
   Running, 45 min | Ritmo: 8.65 min/km
   Cycling, 60 min | Ritmo: 3.00 min/km
💪 Fuerza (5 ejercicios)
   Bench Press, 30 min | Volumen: 2400 kg
   Barbell Row, 45 min | Volumen: 3200 kg
   Pull-up, 30 min | Volumen: 800 kg
   Seated Row, 40 min | Volumen: 1800 kg
   Lat Pulldown, 35 min | Volumen: 1500 kg
🧘 Flexibilidad (1 ejercicio)
   Yoga Flow, 40 min | 12 poses
──────────────────────────────────
Total: 8 ejercicios, 325 min

⚠️  Ejercicios con datos incompletos (1):
   Cable Row, campos requeridos faltantes
══════════════════════════════════
```
