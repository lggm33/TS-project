import type {
  Exercise,
  CardioExercise,
  StrengthExercise,
  FlexibilityExercise,
  ExerciseId,
  ApiNinjasExercise,
} from "../types/index.js";
import { ExerciseCategory, WorkoutStatus, ApiNinjasExerciseSchema } from "../types/index.js";
import type { IExerciseRepository } from "../repositories/ExerciseRepository.js";
import type { ExerciseApiClient } from "../clients/ExerciseApiClient.js";
import { assertNever } from "../utils/assertions.js";

type CardioInput = Omit<CardioExercise, "id" | "pace" | "status" | "finalCaloriesBurned">;
type StrengthInput = Omit<StrengthExercise, "id" | "status" | "finalWeightLifted">;
type FlexibilityInput = Omit<FlexibilityExercise, "id" | "status" | "finalCommentsUser">;

export type NewExerciseInput = CardioInput | StrengthInput | FlexibilityInput;

export type InvalidExercise = {
  raw: unknown;
  reason: string;
};

export type ValidationResult = {
  valid: ApiNinjasExercise[];
  invalid: InvalidExercise[];
};

const MAX_API_RESULTS_PER_QUERY = 5;
const INVALID_REASON_NOT_ARRAY = "respuesta inesperada de la API";
const INVALID_REASON_MISSING_FIELDS = "campos requeridos faltantes";

export class ExerciseService {
  private repository: IExerciseRepository;
  private apiClient: ExerciseApiClient | null;
  private currentId: ExerciseId = 1;
  private invalidHistory: InvalidExercise[] = [];

  constructor(repository: IExerciseRepository, apiClient?: ExerciseApiClient) {
    this.repository = repository;
    this.apiClient = apiClient ?? null;
  }

  public createExerciseTemplate(data: NewExerciseInput): Exercise {
    const newExercise = this.buildExerciseTemplate(data);
    this.repository.save(newExercise);
    return newExercise;
  }

  public generateExercise(templateId: ExerciseId): Exercise | undefined {
    const template = this.getExerciseTemplate(templateId);
    if (!template) {
      return undefined;
    }
    return structuredClone(template);
  }

  public getExerciseTemplate(id: ExerciseId): Exercise | undefined {
    return this.repository.findById(id);
  }

  public getAllExerciseTemplates(): Exercise[] {
    return this.repository.findAll();
  }

  public getInvalidHistory(): readonly InvalidExercise[] {
    return this.invalidHistory;
  }

  public clearInvalidHistory(): void {
    this.invalidHistory = [];
  }

  private buildExerciseTemplate(data: NewExerciseInput): Exercise {
    const id = this.nextId();

    switch (data.category) {
      case ExerciseCategory.CARDIO:
        return { ...data, id, pace: this.calculatePace(data), status: WorkoutStatus.PENDING, finalCaloriesBurned: 0 };
      case ExerciseCategory.STRENGTH:
        return { ...data, id, status: WorkoutStatus.PENDING, finalWeightLifted: 0 };
      case ExerciseCategory.FLEXIBILITY:
        return { ...data, id, status: WorkoutStatus.PENDING, finalCommentsUser: "" };
      default:
        return assertNever(data);
    }
  }

  private calculatePace(data: CardioInput): number {
    if (data.distance <= 0) {
      return 0;
    }
    const pace = data.duration / data.distance;
    return Number(pace.toFixed(2));
  }

  public async searchByMuscle(muscle: string): Promise<ValidationResult> {
    if (!this.apiClient) {
      throw new Error("API client is not configured");
    }
    const rawPayload = await this.apiClient.searchByMuscle(muscle);
    const result = this.validateExercises(rawPayload);
    this.invalidHistory.push(...result.invalid);
    return result;
  }

  public validateExercises(payload: unknown): ValidationResult {
    const result: ValidationResult = { valid: [], invalid: [] };

    if (!Array.isArray(payload)) {
      result.invalid.push({ raw: payload, reason: INVALID_REASON_NOT_ARRAY });
      return result;
    }

    const items = payload.slice(0, MAX_API_RESULTS_PER_QUERY);

    for (const item of items) {
      const parsed = ApiNinjasExerciseSchema.safeParse(item);
      if (parsed.success) {
        result.valid.push(parsed.data);
      } else {
        result.invalid.push({ raw: item, reason: INVALID_REASON_MISSING_FIELDS });
      }
    }

    return result;
  }

  private nextId(): ExerciseId {
    const id = this.currentId;
    this.currentId += 1;
    return id;
  }
}
