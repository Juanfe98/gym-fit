import type { Exercise } from '../types';

const BASE_URL = 'https://oss.exercisedb.dev/api/v1';
const PAGE_SIZE = 25;

type RawExercise = {
  exerciseId: string;
  name: string;
  gifUrl: string;
  bodyParts: string[];
  equipments: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
};

type ApiPage = {
  success: boolean;
  meta: { total: number; hasNextPage: boolean; nextCursor: string };
  data: RawExercise[];
};

function mapExercise(raw: RawExercise): Exercise {
  return {
    id: raw.exerciseId,
    name: raw.name,
    gifUrl: raw.gifUrl,
    bodyPart: raw.bodyParts[0] ?? '',
    target: raw.targetMuscles[0] ?? '',
    secondaryMuscles: raw.secondaryMuscles,
    equipment: raw.equipments[0] ?? '',
  };
}

export type ExercisePage = {
  data: Exercise[];
  meta: { total: number; hasNextPage: boolean; nextCursor: string };
};

export async function fetchExercisePage(cursor?: string): Promise<ExercisePage> {
  const url = new URL(`${BASE_URL}/exercises`);
  url.searchParams.set('limit', String(PAGE_SIZE));
  if (cursor) url.searchParams.set('after', cursor);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`ExerciseDB fetch failed: ${response.status} ${response.statusText}`);
  }

  const page: ApiPage = await response.json();
  return {
    data: page.data.map(mapExercise),
    meta: page.meta,
  };
}
