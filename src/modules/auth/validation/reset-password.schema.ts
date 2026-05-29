import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .refine((val) => /\d/.test(val), 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
