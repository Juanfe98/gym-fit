export type Goal = 'muscle-gain' | 'strength' | 'fat-loss' | 'conditioning';

export type ExerciseKey =
  | 'barbell-bench-press'
  | 'incline-dumbbell-press'
  | 'cable-crossover'
  | 'barbell-overhead-press'
  | 'cable-triceps-pushdown'
  | 'barbell-bent-over-row'
  | 'lat-pulldown'
  | 'seated-cable-row'
  | 'cable-face-pull'
  | 'barbell-curl'
  | 'barbell-back-squat'
  | 'romanian-deadlift'
  | 'leg-press'
  | 'lying-leg-curl'
  | 'standing-calf-raise'
  | 'barbell-incline-bench-press'
  | 'pull-up'
  | 'dumbbell-shoulder-press'
  | 'dumbbell-hammer-curl'
  | 'skull-crusher'
  | 'hack-squat'
  | 'barbell-glute-bridge'
  | 'leg-extension'
  | 'bulgarian-split-squat'
  | 'barbell-good-morning'
  | 'close-grip-bench-press'
  | 'dips'
  | 'barbell-deadlift'
  | 'dumbbell-lateral-raise'
  | 'goblet-squat'
  | 'kettlebell-swing'
  | 'mountain-climbers'
  | 'push-up'
  | 'burpee'
  | 'incline-dumbbell-curl'
  | 'box-jump';

export interface ExerciseRef {
  exerciseKey: ExerciseKey;
  name: string;
  rationale: string;
  formCues: string[];
  commonMistakes: string[];
}

export interface TrainingDay {
  label: string;
  focus: string;
  exercises: ExerciseRef[];
}

export interface Routine {
  goal: Goal;
  displayName: string;
  rationale: string;
  days: TrainingDay[];
}

export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
}

export interface MuscleHighlight {
  primary: string[];
  secondary: string[];
}
