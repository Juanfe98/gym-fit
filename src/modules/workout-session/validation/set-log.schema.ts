import { z } from 'zod'

export const setInputSchema = z.object({
  weight: z.number().min(0.01),
  weightUnit: z.enum(['kg', 'lbs']),
  reps: z.number().int().min(1),
  setType: z.enum(['normal', 'warmup', 'dropset']),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
})

export type SetInputSchema = z.infer<typeof setInputSchema>
