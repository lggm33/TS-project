const API_BASE_URL = "https://api.api-ninjas.com/v1/exercises";

export class ExerciseApiClient {
  private apiKey: string;

  constructor() {
    const key = process.env.API_NINJAS_KEY;
    if (!key) {
      throw new Error("API_NINJAS_KEY environment variable is not set");
    }
    this.apiKey = key;
  }

  public async searchByMuscle(muscle: string): Promise<unknown> {
    const url = `${API_BASE_URL}?muscle=${encodeURIComponent(muscle)}`;

    const response = await fetch(url, {
      headers: { "X-Api-Key": this.apiKey },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
