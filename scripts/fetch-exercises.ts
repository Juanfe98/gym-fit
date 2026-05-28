import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { fetchExercisePage } from '../src/services/exercisedb';
import type { Exercise } from '../src/types';

const OUTPUT_PATH = 'src/data/exercises/exercises.json';
const CURSOR_PATH = 'src/data/exercises/.fetch-cursor';
const BATCH_SIZE = 10; // pages × 25 = 250 exercises per run
const FULL_DATASET_MIN = 1000;

// Load existing accumulated exercises
let exercises: Exercise[] = [];
if (existsSync(OUTPUT_PATH)) {
  try {
    const parsed = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'));
    if (Array.isArray(parsed)) exercises = parsed;
  } catch {
    // corrupt file — start fresh
  }
}

// Check if already complete
if (exercises.length >= FULL_DATASET_MIN && !existsSync(CURSOR_PATH)) {
  console.log(
    `exercises.json already has ${exercises.length} exercises — done. Delete the file to start over.`,
  );
  process.exit(0);
}

// Load cursor from previous run (undefined = start from beginning)
let cursor: string | undefined;
if (existsSync(CURSOR_PATH)) {
  cursor = readFileSync(CURSOR_PATH, 'utf-8').trim() || undefined;
  console.log(`Resuming from cursor: ${cursor} (${exercises.length} exercises already fetched)`);
} else {
  console.log('Starting fresh fetch from oss.exercisedb.dev...');
}

// Fetch one batch
let hasNext = true;
let pagesThisRun = 0;

while (hasNext && pagesThisRun < BATCH_SIZE) {
  const { data, meta } = await fetchExercisePage(cursor);
  exercises.push(...data);
  hasNext = meta.hasNextPage;
  cursor = meta.nextCursor;
  pagesThisRun++;
  process.stdout.write(`\r  Fetched ${exercises.length} / ${meta.total}`);

  if (hasNext && pagesThisRun < BATCH_SIZE) {
    await new Promise((r) => setTimeout(r, 300));
  }
}

process.stdout.write('\n');

// Save accumulated exercises
writeFileSync(OUTPUT_PATH, JSON.stringify(exercises, null, 2));

if (hasNext) {
  // Save cursor for next run
  writeFileSync(CURSOR_PATH, cursor ?? '');
  console.log(`Batch done. ${exercises.length} exercises saved.`);
  console.log(`Run the script again to fetch the next batch.`);
} else {
  // All done — clean up cursor file
  if (existsSync(CURSOR_PATH)) unlinkSync(CURSOR_PATH);
  console.log(`All ${exercises.length} exercises fetched and saved to ${OUTPUT_PATH}`);
}
