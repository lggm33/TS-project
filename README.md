# Routine Management CLI

A command-line interface (CLI) application to manage users, exercises, and fitness routines. Built with TypeScript and Node.js.

## Architecture

The project follows SOLID and DRY principles, organized into three main layers:
1. **Data Layer (Repositories)**: In-memory storage for users and exercises. Data is reset upon application restart.
2. **Service Layer (Business Logic)**: Handles the creation and management of entities (`UserService`, `ExerciseService`, `RoutineService`).
3. **Presentation Layer (CLI)**: Interactive prompts using `@inquirer/prompts` to interact with the user.

## Prerequisites

- Node.js
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

To run the interactive CLI, use the following command:

```bash
npm run cli
```

This command will automatically compile the TypeScript code and start the interactive menu.

### Available Commands

- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run cli`: Compiles and runs the interactive CLI menu.
- `npm start`: Runs the compiled JavaScript code from the `dist` folder.

## Features

- **Add User**: Create a new user profile with personal details and fitness goals.
- **Add Exercise**: Add a new exercise to the catalog with duration and calories.
- **Create Routine**: Assign an exercise to a user's weekly routine for a specific day.
- **View Profile**: Display a user's profile, including their weekly routine, total calories, and most intense day.
