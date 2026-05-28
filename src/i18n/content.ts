import type { ExerciseKey, Goal } from '../types';
import type { Language } from './config';

export const goalDisplayNames: Record<Language, Record<Goal, string>> = {
  en: {
    'muscle-gain': 'Muscle Gain',
    strength: 'Strength',
    'fat-loss': 'Fat Loss',
    conditioning: 'Conditioning',
  },
  es: {
    'muscle-gain': 'Ganancia Muscular',
    strength: 'Fuerza',
    'fat-loss': 'Pérdida de Grasa',
    conditioning: 'Acondicionamiento',
  },
};

export const exerciseDisplayNames: Record<Language, Record<ExerciseKey, string>> = {
  en: {
    'barbell-bench-press': 'Barbell Bench Press',
    'incline-dumbbell-press': 'Incline Dumbbell Press',
    'cable-crossover': 'Cable Crossover',
    'barbell-overhead-press': 'Barbell Overhead Press',
    'cable-triceps-pushdown': 'Cable Triceps Pushdown',
    'barbell-bent-over-row': 'Barbell Bent-Over Row',
    'lat-pulldown': 'Lat Pulldown',
    'seated-cable-row': 'Seated Cable Row',
    'cable-face-pull': 'Cable Face Pull',
    'barbell-curl': 'Barbell Curl',
    'barbell-back-squat': 'Barbell Back Squat',
    'romanian-deadlift': 'Romanian Deadlift',
    'leg-press': 'Leg Press',
    'lying-leg-curl': 'Leg Curl (Machine)',
    'standing-calf-raise': 'Standing Calf Raise',
    'barbell-incline-bench-press': 'Barbell Incline Bench Press',
    'pull-up': 'Pull-Up',
    'dumbbell-shoulder-press': 'Dumbbell Shoulder Press',
    'dumbbell-hammer-curl': 'Dumbbell Hammer Curl',
    'skull-crusher': 'Skull Crusher',
    'hack-squat': 'Hack Squat',
    'barbell-glute-bridge': 'Barbell Glute Bridge',
    'leg-extension': 'Leg Extension',
    'bulgarian-split-squat': 'Bulgarian Split Squat',
    'barbell-good-morning': 'Barbell Good Morning',
    'close-grip-bench-press': 'Close-Grip Bench Press',
    dips: 'Dips',
    'barbell-deadlift': 'Barbell Deadlift',
    'dumbbell-lateral-raise': 'Dumbbell Lateral Raise',
    'goblet-squat': 'Goblet Squat',
    'kettlebell-swing': 'Kettlebell Swing',
    'mountain-climbers': 'Mountain Climbers',
    'push-up': 'Push-Up',
    burpee: 'Burpee',
    'incline-dumbbell-curl': 'Incline Dumbbell Curl',
    'box-jump': 'Box Jump',
  },
  es: {
    'barbell-bench-press': 'Press de Banca con Barra',
    'incline-dumbbell-press': 'Press Inclinado con Mancuernas',
    'cable-crossover': 'Cruce de Poleas',
    'barbell-overhead-press': 'Press Militar con Barra',
    'cable-triceps-pushdown': 'Extensión de Tríceps en Polea',
    'barbell-bent-over-row': 'Remo Inclinado con Barra',
    'lat-pulldown': 'Jalón al Pecho',
    'seated-cable-row': 'Remo Sentado en Polea',
    'cable-face-pull': 'Face Pull en Polea',
    'barbell-curl': 'Curl con Barra',
    'barbell-back-squat': 'Sentadilla Trasera con Barra',
    'romanian-deadlift': 'Peso Muerto Rumano',
    'leg-press': 'Prensa de Piernas',
    'lying-leg-curl': 'Curl Femoral en Máquina',
    'standing-calf-raise': 'Elevación de Gemelos de Pie',
    'barbell-incline-bench-press': 'Press Inclinado con Barra',
    'pull-up': 'Dominada',
    'dumbbell-shoulder-press': 'Press de Hombros con Mancuernas',
    'dumbbell-hammer-curl': 'Curl Martillo con Mancuernas',
    'skull-crusher': 'Rompecráneos',
    'hack-squat': 'Sentadilla Hack',
    'barbell-glute-bridge': 'Puente de Glúteos con Barra',
    'leg-extension': 'Extensión de Piernas',
    'bulgarian-split-squat': 'Sentadilla Búlgara',
    'barbell-good-morning': 'Good Morning con Barra',
    'close-grip-bench-press': 'Press de Banca con Agarre Cerrado',
    dips: 'Fondos',
    'barbell-deadlift': 'Peso Muerto con Barra',
    'dumbbell-lateral-raise': 'Elevación Lateral con Mancuernas',
    'goblet-squat': 'Sentadilla Goblet',
    'kettlebell-swing': 'Swing con Kettlebell',
    'mountain-climbers': 'Escaladores',
    'push-up': 'Flexión de Pecho',
    burpee: 'Burpee',
    'incline-dumbbell-curl': 'Curl Inclinado con Mancuernas',
    'box-jump': 'Salto al Cajón',
  },
};

const equipmentLabels: Record<Language, Record<string, string>> = {
  en: {},
  es: {
    barbell: 'barra',
    dumbbell: 'mancuerna',
    cable: 'polea',
    'body weight': 'peso corporal',
    'sled machine': 'máquina tipo trineo',
    'leverage machine': 'máquina de palanca',
    kettlebell: 'kettlebell',
    weighted: 'lastrado',
  },
};

const muscleLabels: Record<Language, Record<string, string>> = {
  en: {},
  es: {
    pectorals: 'pectorales',
    delts: 'deltoides',
    triceps: 'tríceps',
    'upper back': 'espalda alta',
    lats: 'dorsales',
    biceps: 'bíceps',
    glutes: 'glúteos',
    hamstrings: 'isquiotibiales',
    quads: 'cuádriceps',
    calves: 'gemelos',
    'cardiovascular system': 'sistema cardiovascular',
  },
};

export function getGoalDisplayName(goal: Goal, lang: Language): string {
  return goalDisplayNames[lang][goal];
}

export function getExerciseDisplayName(exerciseKey: ExerciseKey, lang: Language): string {
  return exerciseDisplayNames[lang][exerciseKey];
}

export function getEquipmentLabel(equipment: string, lang: Language): string {
  return equipmentLabels[lang][equipment] ?? equipment;
}

export function getMuscleLabel(muscle: string, lang: Language): string {
  return muscleLabels[lang][muscle] ?? muscle;
}

export function getLocalizedDayLabel(label: string, lang: Language): string {
  if (lang === 'es') return label.replace(/^Day\s+(\d+)$/i, 'Día $1');
  return label;
}
