import type { Goal, Routine } from '../../types';
import { muscleGainRoutine } from './muscle-gain';
import { strengthRoutine } from './strength';
import { fatLossRoutine } from './fat-loss';
import { conditioningRoutine } from './conditioning';

export const ROUTINES: Record<Goal, Routine> = {
  'muscle-gain': muscleGainRoutine,
  strength: strengthRoutine,
  'fat-loss': fatLossRoutine,
  conditioning: conditioningRoutine,
};
