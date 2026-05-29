import { z } from 'zod'

export const planFormSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(100),
  goal: z.enum(['muscle-gain', 'fat-loss', 'strength', 'conditioning', 'general']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  durationWeeks: z.number().int().min(1).max(52).nullable(),
  daysPerWeek: z.number().int().min(1).max(7),
  description: z.string().max(500).nullable(),
})

export type PlanFormValues = z.infer<typeof planFormSchema>

export const planExerciseFormSchema = z
  .object({
    targetSets: z.number().int().min(1).max(20).nullable(),
    targetReps: z.number().int().min(1).max(100).nullable(),
    targetRepRangeMin: z.number().int().min(1).max(100).nullable(),
    targetRepRangeMax: z.number().int().min(1).max(100).nullable(),
    targetWeight: z.number().min(0).max(9999).nullable(),
    restSeconds: z.number().int().min(0).max(600).nullable(),
    notes: z.string().max(500).nullable(),
  })
  .refine((d) => !(d.targetReps && d.targetRepRangeMin), {
    message: 'Use either exact reps or a rep range, not both',
  })

export type PlanExerciseFormValues = z.infer<typeof planExerciseFormSchema>

export const workoutDaySchema = z.object({
  name: z.string().min(1).max(80),
})
