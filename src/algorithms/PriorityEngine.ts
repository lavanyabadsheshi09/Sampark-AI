export type MedicalUrgency = "Critical" | "High" | "Medium" | "Low";
export type Accessibility =
  | "Difficult"
  | "Challenging"
  | "Moderate"
  | "Easy";
export type WeatherRisk = "High" | "Moderate" | "Low";

export interface VillageRequest {
  id: string;
  name: string;
  state: string;
  population: number;
  medicalUrgency: MedicalUrgency;
  stockRemaining: number;
  accessibility: Accessibility;
  weatherRisk: WeatherRisk;
  distanceKm: number;
}

export interface RankedVillage extends VillageRequest {
  priorityScore: number;
  priorityLevel: "Critical" | "High" | "Moderate" | "Low";
  rank: number;
  factorScores: {
    medical: number;
    population: number;
    stock: number;
    accessibility: number;
    weather: number;
    distance: number;
  };
}

const MEDICAL_SCORE: Record<MedicalUrgency, number> = {
  Critical: 100,
  High: 80,
  Medium: 60,
  Low: 30,
};

const ACCESSIBILITY_SCORE: Record<Accessibility, number> = {
  Difficult: 100,
  Challenging: 75,
  Moderate: 50,
  Easy: 25,
};

const WEATHER_SCORE: Record<WeatherRisk, number> = {
  High: 100,
  Moderate: 60,
  Low: 20,
};

function normalize(value: number, min: number, max: number) {
  if (max === min) return 100;

  return ((value - min) / (max - min)) * 100;
}

function getPriorityLevel(score: number): RankedVillage["priorityLevel"] {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 50) return "Moderate";
  return "Low";
}

export function rankVillages(
  villages: VillageRequest[]
): RankedVillage[] {
  const populations = villages.map((v) => v.population);
  const distances = villages.map((v) => v.distanceKm);

  const minPopulation = Math.min(...populations);
  const maxPopulation = Math.max(...populations);

  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);

  return villages
    .map((village) => {
      const medical = MEDICAL_SCORE[village.medicalUrgency];

      const population = normalize(
        village.population,
        minPopulation,
        maxPopulation
      );

      // Lower stock = higher emergency priority
      const stock = 100 - village.stockRemaining;

      const accessibility =
        ACCESSIBILITY_SCORE[village.accessibility];

      const weather = WEATHER_SCORE[village.weatherRisk];

      const distance = normalize(
        village.distanceKm,
        minDistance,
        maxDistance
      );

      const score =
        medical * 0.30 +
        population * 0.20 +
        stock * 0.20 +
        accessibility * 0.10 +
        weather * 0.15 +
        distance * 0.05;

      return {
        ...village,
        priorityScore: Math.round(score),
        priorityLevel: getPriorityLevel(score),
        rank: 0,
        factorScores: {
          medical: Math.round(medical),
          population: Math.round(population),
          stock: Math.round(stock),
          accessibility: Math.round(accessibility),
          weather: Math.round(weather),
          distance: Math.round(distance),
        },
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((village, index) => ({
      ...village,
      rank: index + 1,
    }));
}