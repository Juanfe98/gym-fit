// Maps ExerciseDB muscle name strings to data-muscle attribute values in the SVG diagrams.
// SVG elements are selected by [data-muscle="{id}"] at render time in MuscleDiagram.astro.
const MUSCLE_MAP: Record<string, string> = {
  // Chest
  pectorals: 'chest',
  'pectoralis major': 'chest',

  // Upper back
  lats: 'upper-back',
  'upper back': 'upper-back',
  rhomboids: 'upper-back',
  'levator scapulae': 'upper-back',
  'upper trapezius': 'upper-back',

  // Lower back
  'lower back': 'lower-back',
  'erector spinae': 'lower-back',
  spine: 'lower-back',

  // Traps (posterior)
  traps: 'trapezius',
  trapezius: 'trapezius',

  // Abs
  abs: 'abs',
  'rectus abdominis': 'abs',
  'serratus anterior': 'abs',
  'transverse abdominis': 'abs',

  // Obliques
  obliques: 'obliques',

  // Biceps
  biceps: 'biceps',
  'biceps brachii': 'biceps',
  brachialis: 'biceps',
  brachioradialis: 'biceps',

  // Triceps
  triceps: 'triceps',
  'triceps brachii': 'triceps',

  // Front deltoids
  delts: 'front-deltoids',
  'anterior deltoids': 'front-deltoids',
  'medial deltoids': 'front-deltoids',
  'lateral deltoids': 'front-deltoids',

  // Back deltoids
  'posterior deltoids': 'back-deltoids',
  infraspinatus: 'back-deltoids',
  'teres minor': 'back-deltoids',
  'teres major': 'back-deltoids',

  // Forearms
  forearms: 'forearm',
  forearm: 'forearm',

  // Glutes
  glutes: 'gluteal',
  'gluteus maximus': 'gluteal',
  'gluteus medius': 'gluteal',
  'gluteus minimus': 'gluteal',

  // Hamstrings
  hamstrings: 'hamstring',
  'biceps femoris': 'hamstring',

  // Quads
  quads: 'quadriceps',
  quadriceps: 'quadriceps',
  'rectus femoris': 'quadriceps',
  'vastus medialis': 'quadriceps',
  'quadriceps femoris': 'quadriceps',

  // Calves
  calves: 'calves',
  gastrocnemius: 'calves',
  soleus: 'calves',
  'tibialis anterior': 'calves',

  // Adductors / abductors
  adductors: 'adductor',
  'adductor magnus': 'adductor',
  abductors: 'abductors',
  'tensor fasciae latae': 'abductors',

  // Neck
  neck: 'neck',
};

export function getMuscleId(name: string): string | undefined {
  return MUSCLE_MAP[name.toLowerCase()];
}
