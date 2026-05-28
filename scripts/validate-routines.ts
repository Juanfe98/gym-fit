import exercises from '../src/data/exercises/exercises.json';
import { EXERCISE_CATALOG } from '../src/data/exercises/catalog';
import { ROUTINES } from '../src/data/routines';
import type { Exercise } from '../src/types';

const cachedById = new Map((exercises as Exercise[]).map((exercise) => [exercise.id, exercise]));
const errors: string[] = [];

for (const [goal, routine] of Object.entries(ROUTINES)) {
  for (const day of routine.days) {
    if (day.exercises.length !== 5) {
      errors.push(`${goal} ${day.label} has ${day.exercises.length} exercises; expected 5.`);
    }

    for (const ref of day.exercises) {
      const catalogEntry = EXERCISE_CATALOG[ref.exerciseKey];
      if (!catalogEntry) {
        errors.push(`${goal} ${day.label}: ${ref.name} uses missing exerciseKey '${ref.exerciseKey}'.`);
        continue;
      }

      const cached = cachedById.get(catalogEntry.exerciseDbId);
      if (!cached) {
        errors.push(
          `${goal} ${day.label}: ${ref.name} maps to ExerciseDB id '${catalogEntry.exerciseDbId}', but it is not in exercises.json.`,
        );
        continue;
      }

      if (!cached.gifUrl) {
        errors.push(`${goal} ${day.label}: ${ref.name} (${catalogEntry.exerciseDbId}) has no gifUrl.`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Routine validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const usedKeys = new Set(
  Object.values(ROUTINES).flatMap((routine) => routine.days.flatMap((day) => day.exercises.map((ref) => ref.exerciseKey))),
);

console.log(
  `Routine validation passed: ${usedKeys.size} curated exercises linked to cached ExerciseDB media.`,
);
