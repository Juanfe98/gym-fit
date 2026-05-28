import type { ExerciseKey } from '../../types';

export type CatalogExercise = {
  displayName: string;
  exerciseDbId: string;
  notes?: string;
};

/**
 * Curated app-level exercise catalog.
 *
 * Routines reference these stable keys. ExerciseDB ids are provider-specific media
 * references and can be changed here without rewriting routine programming copy.
 */
export const EXERCISE_CATALOG = {
  'barbell-bench-press': { displayName: 'Barbell Bench Press', exerciseDbId: 'EIeI8Vf' },
  'incline-dumbbell-press': { displayName: 'Incline Dumbbell Press', exerciseDbId: 'ns0SIbU' },
  'cable-crossover': { displayName: 'Cable Crossover', exerciseDbId: 'UKWTJWR' },
  'barbell-overhead-press': { displayName: 'Barbell Overhead Press', exerciseDbId: 'kTbSH9h' },
  'cable-triceps-pushdown': { displayName: 'Cable Triceps Pushdown', exerciseDbId: 'gAwDzB3' },
  'barbell-bent-over-row': { displayName: 'Barbell Bent-Over Row', exerciseDbId: 'eZyBC3j' },
  'lat-pulldown': { displayName: 'Lat Pulldown', exerciseDbId: 'LEprlgG' },
  'seated-cable-row': { displayName: 'Seated Cable Row', exerciseDbId: 'fUBheHs' },
  'cable-face-pull': {
    displayName: 'Cable Face Pull',
    exerciseDbId: 'G61cXLk',
    notes: 'Closest available ExerciseDB media is a rope rear-delt row; routine cues preserve face-pull external-rotation intent.',
  },
  'barbell-curl': { displayName: 'Barbell Curl', exerciseDbId: '25GPyDY' },
  'barbell-back-squat': { displayName: 'Barbell Back Squat', exerciseDbId: 'qXTaZnJ' },
  'romanian-deadlift': { displayName: 'Romanian Deadlift', exerciseDbId: 'wQ2c4XD' },
  'leg-press': { displayName: 'Leg Press', exerciseDbId: '10Z2DXU' },
  'lying-leg-curl': { displayName: 'Leg Curl (Machine)', exerciseDbId: '17lJ1kr' },
  'standing-calf-raise': { displayName: 'Standing Calf Raise', exerciseDbId: '8ozhUIZ' },
  'barbell-incline-bench-press': { displayName: 'Barbell Incline Bench Press', exerciseDbId: '3TZduzM' },
  'pull-up': { displayName: 'Pull-Up', exerciseDbId: 'lBDjFxJ' },
  'dumbbell-shoulder-press': { displayName: 'Dumbbell Shoulder Press', exerciseDbId: 'znQUdHY' },
  'dumbbell-hammer-curl': { displayName: 'Dumbbell Hammer Curl', exerciseDbId: 'slDvUAU' },
  'skull-crusher': { displayName: 'Skull Crusher', exerciseDbId: 'h8LFzo9' },
  'hack-squat': { displayName: 'Hack Squat', exerciseDbId: 'Qa55kX1' },
  'barbell-glute-bridge': {
    displayName: 'Barbell Glute Bridge',
    exerciseDbId: 'qKBpF7I',
    notes: 'Used instead of barbell hip thrust because the cached ExerciseDB dataset does not include a barbell hip-thrust GIF.',
  },
  'leg-extension': { displayName: 'Leg Extension', exerciseDbId: 'my33uHU' },
  'bulgarian-split-squat': { displayName: 'Bulgarian Split Squat', exerciseDbId: 'qx4fgX7' },
  'barbell-good-morning': { displayName: 'Barbell Good Morning', exerciseDbId: 'XlZ4lAC' },
  'close-grip-bench-press': { displayName: 'Close-Grip Bench Press', exerciseDbId: 'J6Dx1Mu' },
  dips: { displayName: 'Dips', exerciseDbId: 'bZq4bwK' },
  'barbell-deadlift': { displayName: 'Barbell Deadlift', exerciseDbId: 'ila4NZS' },
  'dumbbell-lateral-raise': { displayName: 'Dumbbell Lateral Raise', exerciseDbId: 'DsgkuIt' },
  'goblet-squat': { displayName: 'Goblet Squat', exerciseDbId: 'yn8yg1r' },
  'kettlebell-swing': { displayName: 'Kettlebell Swing', exerciseDbId: 'UHJlbu3' },
  'mountain-climbers': { displayName: 'Mountain Climbers', exerciseDbId: 'RJgzwny' },
  'push-up': { displayName: 'Push-Up', exerciseDbId: 'I4hDWkc' },
  burpee: { displayName: 'Burpee', exerciseDbId: 'dK9394r' },
  'incline-dumbbell-curl': { displayName: 'Incline Dumbbell Curl', exerciseDbId: 'ae9UoXQ' },
  'box-jump': { displayName: 'Box Jump', exerciseDbId: 'iPm26QU' },
} as const satisfies Record<ExerciseKey, CatalogExercise>;
