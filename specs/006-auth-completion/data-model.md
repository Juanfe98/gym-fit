# Data Model: Auth Completion

## No New Supabase Tables

This spec adds no new database tables or RLS policies. Authentication state is managed entirely by Supabase Auth (the `auth.users` table managed by Supabase).

---

## Frontend Domain Types

### `src/modules/auth/types/index.ts`

```ts
// Zod schema inference types — defined in validation files, re-exported here
export type { SignUpInput } from '../validation/sign-up.schema'
export type { ForgotPasswordInput } from '../validation/forgot-password.schema'
export type { ResetPasswordInput } from '../validation/reset-password.schema'
```

---

## Zod Validation Schemas

### Sign Up — `src/modules/auth/validation/sign-up.schema.ts`

Fields:
| Field | Type | Rules |
|-------|------|-------|
| `name` | `string` | required, min 1 char |
| `email` | `string` | required, valid email format |
| `password` | `string` | required, min 8 chars, at least one digit |
| `confirmPassword` | `string` | required; cross-field: must equal `password` |
| `termsAccepted` | `boolean` | must be `true` |

Cross-field validation: `confirmPassword !== password` adds issue to `confirmPassword` path.

### Forgot Password — `src/modules/auth/validation/forgot-password.schema.ts`

Fields:
| Field | Type | Rules |
|-------|------|-------|
| `email` | `string` | required, valid email format |

### Reset Password — `src/modules/auth/validation/reset-password.schema.ts`

Fields:
| Field | Type | Rules |
|-------|------|-------|
| `password` | `string` | required, min 8 chars, at least one digit |
| `confirmPassword` | `string` | required; cross-field: must equal `password` |

---

## i18n Keys Required

All keys must be added to both `en` and `es` blocks in `src/i18n/ui.ts`.

| Key | English value | Spanish value |
|-----|---------------|---------------|
| `signUp` | `Sign up` | `Registrarse` |
| `signingUp` | `Creating account…` | `Creando cuenta…` |
| `name` | `Name` | `Nombre` |
| `confirmPassword` | `Confirm password` | `Confirmar contraseña` |
| `termsLabel` | `I accept the terms of service` | `Acepto los términos de servicio` |
| `signUpTitle` | `Create your account` | `Crea tu cuenta` |
| `alreadyHaveAccount` | `Already have an account?` | `¿Ya tienes una cuenta?` |
| `authError` | `Something went wrong. Please try again.` | `Algo salió mal. Por favor inténtalo de nuevo.` |
| `authNetworkError` | `Connection error. Check your network and try again.` | `Error de conexión. Verifica tu red e inténtalo de nuevo.` |
| `forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |
| `forgotPasswordTitle` | `Reset your password` | `Restablece tu contraseña` |
| `forgotPasswordSubtitle` | `Enter your email and we'll send you a reset link.` | `Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.` |
| `sendResetLink` | `Send reset link` | `Enviar enlace` |
| `sendingResetLink` | `Sending…` | `Enviando…` |
| `resetLinkSent` | `Check your inbox` | `Revisa tu bandeja de entrada` |
| `resetLinkSentBody` | `If an account exists for that email, a reset link is on its way.` | `Si existe una cuenta para ese correo, recibirás un enlace en breve.` |
| `backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
| `resetPasswordTitle` | `Set new password` | `Establece una nueva contraseña` |
| `newPassword` | `New password` | `Nueva contraseña` |
| `savePassword` | `Save password` | `Guardar contraseña` |
| `savingPassword` | `Saving…` | `Guardando…` |
| `resetLinkInvalid` | `This reset link is invalid or has expired.` | `Este enlace es inválido o ha expirado.` |
| `requestNewLink` | `Request a new link` | `Solicitar un nuevo enlace` |
| `verifyEmailTitle` | `Check your inbox` | `Revisa tu bandeja de entrada` |
| `verifyEmailBody` | `We sent a confirmation email. Click the link to activate your account.` | `Enviamos un correo de confirmación. Haz clic en el enlace para activar tu cuenta.` |
| `resendEmail` | `Resend email` | `Reenviar correo` |
| `resendingEmail` | `Sending…` | `Enviando…` |
| `emailResentConfirm` | `Email sent. Check your inbox.` | `Correo enviado. Revisa tu bandeja de entrada.` |
| `sessionExpiredTitle` | `Session expired` | `Sesión expirada` |
| `sessionExpiredBody` | `Your session is no longer active. Please sign in again.` | `Tu sesión ya no está activa. Por favor inicia sesión nuevamente.` |
| `signInAgain` | `Sign in again` | `Iniciar sesión nuevamente` |
| `dontHaveAccount` | `Don't have an account?` | `¿No tienes una cuenta?` |
| `passwordRequirements` | `At least 8 characters and one number` | `Al menos 8 caracteres y un número` |
