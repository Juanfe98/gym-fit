import exercises from '../data/exercises/exercises.json';
import { EXERCISE_CATALOG } from '../data/exercises/catalog';
import type { Exercise, ExerciseKey } from '../types';

const exercisesById = new Map((exercises as Exercise[]).map((exercise) => [exercise.id, exercise]));

export function getCatalogExercise(exerciseKey: ExerciseKey) {
  return EXERCISE_CATALOG[exerciseKey];
}

export function getExerciseByKey(exerciseKey: ExerciseKey): Exercise | undefined {
  return exercisesById.get(EXERCISE_CATALOG[exerciseKey].exerciseDbId);
}

export function getExerciseByExerciseDbId(exerciseDbId: string): Exercise | undefined {
  return exercisesById.get(exerciseDbId);
}

export function getExercisePageId(exerciseKey: ExerciseKey): string {
  return EXERCISE_CATALOG[exerciseKey].exerciseDbId;
}
