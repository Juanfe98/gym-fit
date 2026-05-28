import type { ExerciseRef, Goal, Routine, TrainingDay } from '../types';
import type { Language } from './config';
import { genericSpanishExerciseCopy } from './exercise-copy-es';

const routineRationales: Partial<Record<Language, Partial<Record<Goal, string>>>> = {
  es: {
    'muscle-gain':
      'Una estructura Push/Pull/Legs con un día adicional de volumen superior–inferior trabaja cada grupo muscular 2 veces por semana, una frecuencia muy efectiva para hipertrofia. La rutina prioriza movimientos compuestos al inicio para generar tensión mecánica y termina con aislamientos para acumular estrés metabólico. Los descansos se ubican después del día de piernas y al final de la semana para favorecer la recuperación de las sesiones con mayor volumen.',
    strength:
      'Una división inspirada en powerlifting dedica días específicos a los patrones de sentadilla, press de banca y peso muerto, usando accesorios para reforzar los puntos débiles que limitan cada levantamiento. Entrenar cada movimiento principal una vez por semana con alta intensidad permite recuperar el sistema nervioso, que suele ser el factor limitante en el desarrollo de fuerza máxima. Los días accesorios corrigen grupos musculares rezagados y consolidan la técnica de los tres grandes.',
    'fat-loss':
      'El entrenamiento de cuerpo completo 4 veces por semana maximiza la frecuencia por grupo muscular y el gasto energético semanal. Cada sesión combina un movimiento compuesto de tren inferior, un empuje, un jalón y un accesorio o finalizador metabólico. Esta estructura preserva masa muscular durante un déficit calórico, la diferencia clave entre perder grasa y simplemente perder peso, manteniendo las sesiones por debajo de 60 minutos.',
    conditioning:
      'El acondicionamiento atlético requiere desarrollar fuerza, potencia y capacidad de trabajo al mismo tiempo. Este programa de 5 días combina un día de potencia, dos días enfocados en fuerza y dos sesiones específicas de acondicionamiento. La estructura evita realizar trabajo explosivo con piernas fatigadas, un principio clave para mejorar rendimiento real y no solo condición física general.',
  },
};

const dayFocusTranslations: Partial<Record<Language, Partial<Record<Goal, string[]>>>> = {
  es: {
    'muscle-gain': [
      'Empuje — Pecho y Tríceps',
      'Jalón — Espalda y Bíceps',
      'Piernas — Cuádriceps, Isquios y Glúteos',
      'Superior — Pecho, Espalda y Hombros (Volumen)',
      'Inferior — Glúteos e Isquios (Volumen)',
    ],
    strength: [
      'Sentadilla — Principal + Accesorios',
      'Press de Banca — Principal + Accesorios',
      'Peso Muerto — Principal + Accesorios',
      'Accesorios Superiores — Hombros y Brazos',
      'Accesorios Inferiores — Cadena Posterior',
    ],
    'fat-loss': [
      'Cuerpo Completo A — Patrón de Sentadilla',
      'Cuerpo Completo B — Patrón de Bisagra',
      'Cuerpo Completo C — Volumen y Metabólico',
      'Cuerpo Completo D — Jalón y Acondicionamiento',
    ],
    conditioning: [
      'Potencia — Tren Inferior Explosivo',
      'Fuerza Superior — Empuje y Jalón',
      'Fuerza Inferior — Glúteos y Cadena Posterior',
      'Acondicionamiento — Sistemas Energéticos',
      'Cuerpo Completo Atlético — Integración',
    ],
  },
};

/**
 * Spanish trainer-copy overrides keyed by routine goal, day index, and exercise key.
 * Phase 3 can be completed incrementally without changing route/component code.
 */
type ExerciseCopy = {
  rationale?: string;
  formCues?: string[];
  commonMistakes?: string[];
};

const exerciseCopy: Partial<Record<Language, Record<string, ExerciseCopy>>> = {
  es: {
    'muscle-gain:0:barbell-bench-press': {
      rationale:
        'Constructor principal de masa para el pecho. El press horizontal pesado recluta una gran cantidad de unidades motoras del pectoral y permite progresar la carga en un rango amplio de repeticiones, por eso es la base del día de empuje orientado a hipertrofia.',
      formCues: [
        'Arquea la parte alta de la espalda y retrae las escápulas antes de sacar la barra; esto acorta el recorrido y protege el hombro.',
        'Usa un agarre de 1.5–2 veces el ancho de hombros, con la muñeca apilada sobre el codo en la parte baja.',
        'Toca la barra en la zona baja del esternón, no en la parte alta del pecho; mantén los codos a unos 45–75° del torso.',
        'Empuja el suelo con los pies durante todo el press para transferir fuerza a través del arco.',
        'Aprieta la barra como si quisieras doblarla hacia adentro para activar tríceps y pectoral en el bloqueo.',
      ],
      commonMistakes: [
        'Abrir los codos a 90° aumenta el estrés sobre la cápsula anterior del hombro; mantenlos más cerca del torso.',
        'Rebotar la barra en el pecho elimina tensión del pectoral justo donde el estímulo es más útil.',
        'Perder tensión en la espalda alta permite que los hombros se adelanten, reduciendo fuerza y aumentando riesgo de pinzamiento.',
      ],
    },
    'muscle-gain:0:incline-dumbbell-press': {
      rationale:
        'Enfatiza la porción clavicular del pectoral, que suele recibir menos estímulo con el press plano. Las mancuernas permiten mayor rango de movimiento y trabajo independiente por lado, ayudando a corregir diferencias de fuerza entre brazos.',
      formCues: [
        'Coloca el banco a 30–45°; más inclinación desplaza el trabajo hacia el deltoide anterior.',
        'Baja las mancuernas hacia los lados de la parte alta/media del pecho con los codos a 60–70°.',
        'En la parte alta, presiona y acerca ligeramente las mancuernas pensando en contraer el pecho.',
        'Mantén las escápulas retraídas; permite una ligera protracción solo al final del bloqueo.',
      ],
      commonMistakes: [
        'Usar una inclinación demasiado alta convierte el ejercicio en un press de hombro.',
        'Acelerar la fase excéntrica reduce el estímulo de estiramiento bajo carga; baja en 2–3 segundos.',
      ],
    },
    'muscle-gain:0:cable-crossover': {
      rationale:
        'Las poleas mantienen tensión constante durante todo el recorrido, incluso en la contracción final donde los pesos libres suelen descargarse. Después de los presses pesados, los cruces aportan estrés metabólico y una contracción fuerte del pectoral.',
      formCues: [
        'Ajusta las poleas a la altura de los hombros o un poco por encima y adelántate para que los cables tiren los brazos hacia atrás al inicio.',
        'Inclínate ligeramente hacia delante para alinear la línea de fuerza con las fibras del pectoral.',
        'Lleva los brazos en arco hacia abajo y hacia el centro, cruzando un poco la línea media.',
        'Pausa 1 segundo en la contracción y controla el regreso sin usar impulso.',
      ],
      commonMistakes: [
        'Detener las manos en el centro limita la contracción máxima; cruza ligeramente la línea media.',
        'Balancear el torso transforma el ejercicio en un movimiento de cuerpo completo en lugar de aislamiento de pecho.',
      ],
    },
  },
};

function copyKey(routine: Routine, day: TrainingDay, exerciseRef: ExerciseRef): string {
  const dayIndex = routine.days.indexOf(day);
  return `${routine.goal}:${dayIndex}:${exerciseRef.exerciseKey}`;
}

export function getRoutineRationale(routine: Routine, lang: Language): string {
  return routineRationales[lang]?.[routine.goal] ?? routine.rationale;
}

export function getDayFocus(routine: Routine, day: TrainingDay, lang: Language): string {
  const dayIndex = routine.days.indexOf(day);
  return dayFocusTranslations[lang]?.[routine.goal]?.[dayIndex] ?? day.focus;
}

export function getExerciseRationale(routine: Routine, day: TrainingDay, exerciseRef: ExerciseRef, lang: Language): string {
  return (
    exerciseCopy[lang]?.[copyKey(routine, day, exerciseRef)]?.rationale ??
    (lang === 'es' ? genericSpanishExerciseCopy[exerciseRef.exerciseKey].rationale : undefined) ??
    exerciseRef.rationale
  );
}

export function getExerciseFormCues(routine: Routine, day: TrainingDay, exerciseRef: ExerciseRef, lang: Language): string[] {
  return (
    exerciseCopy[lang]?.[copyKey(routine, day, exerciseRef)]?.formCues ??
    (lang === 'es' ? genericSpanishExerciseCopy[exerciseRef.exerciseKey].formCues : undefined) ??
    exerciseRef.formCues
  );
}

export function getExerciseCommonMistakes(routine: Routine, day: TrainingDay, exerciseRef: ExerciseRef, lang: Language): string[] {
  return (
    exerciseCopy[lang]?.[copyKey(routine, day, exerciseRef)]?.commonMistakes ??
    (lang === 'es' ? genericSpanishExerciseCopy[exerciseRef.exerciseKey].commonMistakes : undefined) ??
    exerciseRef.commonMistakes
  );
}
