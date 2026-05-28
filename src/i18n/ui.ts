import type { Goal } from '../types';
import type { Language } from './config';

export const UI: Record<Language, Record<string, string>> = {
  en: {
    appName: 'Gym Planner',
    homeDescription: 'Science-backed weekly training routines for intermediate to advanced gym-goers.',
    chooseGoalTitle: "What's Your Goal?",
    chooseGoalSubtitle: 'Select a goal to get your complete weekly routine.',
    trainingGoals: 'Training goals',
    footerNote: 'Intermediate to advanced · No account required',
    chooseGoalTitleMeta: 'Gym Planner — Choose Your Goal',
    allGoals: 'All Goals',
    backToGoalSelection: 'Back to goal selection',
    weeklyRoutine: 'Weekly Routine',
    routineRationale: 'Routine rationale',
    trainingDays: 'Training days',
    daySchedule: 'Day Schedule',
    routineTitleSuffix: 'Routine — Gym Planner',
    backTo: 'Back to',
    formCues: 'Form cues',
    commonMistakes: 'Common mistakes',
    whyItIsHere: 'Why it is here',
    muscles: 'Muscles',
    exerciseDemo: 'exercise demonstration',
    exerciseDescriptionSuffix: 'form cues, common mistakes, and animated demo.',
    front: 'Front',
    back: 'Back',
    frontMuscleDiagram: 'Front muscle diagram',
    backMuscleDiagram: 'Back muscle diagram',
  },
  es: {
    appName: 'Gym Planner',
    homeDescription: 'Rutinas semanales basadas en ciencia para personas con nivel intermedio a avanzado.',
    chooseGoalTitle: '¿Cuál es tu objetivo?',
    chooseGoalSubtitle: 'Elige un objetivo para recibir tu rutina semanal completa.',
    trainingGoals: 'Objetivos de entrenamiento',
    footerNote: 'Intermedio a avanzado · Sin cuenta requerida',
    chooseGoalTitleMeta: 'Gym Planner — Elige tu objetivo',
    allGoals: 'Todos los objetivos',
    backToGoalSelection: 'Volver a la selección de objetivo',
    weeklyRoutine: 'Rutina semanal',
    routineRationale: 'Justificación de la rutina',
    trainingDays: 'Días de entrenamiento',
    daySchedule: 'Días por semana',
    routineTitleSuffix: 'Rutina — Gym Planner',
    backTo: 'Volver a',
    formCues: 'Indicaciones de técnica',
    commonMistakes: 'Errores comunes',
    whyItIsHere: 'Por qué está aquí',
    muscles: 'Músculos',
    exerciseDemo: 'demostración del ejercicio',
    exerciseDescriptionSuffix: 'indicaciones de técnica, errores comunes y demostración animada.',
    front: 'Frente',
    back: 'Espalda',
    frontMuscleDiagram: 'Diagrama muscular frontal',
    backMuscleDiagram: 'Diagrama muscular posterior',
  },
};

export const goalSubtitles: Record<Language, Record<Goal, string>> = {
  en: {
    'muscle-gain': 'Build Mass',
    strength: 'Max Strength',
    'fat-loss': 'Burn Fat',
    conditioning: 'Athletic Performance',
  },
  es: {
    'muscle-gain': 'Ganar masa',
    strength: 'Fuerza máxima',
    'fat-loss': 'Quemar grasa',
    conditioning: 'Rendimiento atlético',
  },
};

export function useTranslations(lang: Language) {
  return (key: keyof typeof UI.en) => UI[lang][key] ?? UI.en[key];
}
