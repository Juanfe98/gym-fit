import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .refine((val) => /\d/.test(val), 'Must contain at least one number'),
  confirmPassword: z.string(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, { message: 'You must accept the terms to continue' }),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  }
})

export type SignUpInput = z.infer<typeof signUpSchema>
