'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planFormSchema, type PlanFormValues } from '../validation/plan-schema'
import { useI18n } from '@/i18n/client'

interface PlanFormProps {
  defaultValues?: Partial<PlanFormValues>
  onSubmit: (v: PlanFormValues) => void
  isLoading: boolean
  submitLabel?: string
}

const inputClass =
  'w-full bg-gym-surface-2 border border-gym-border rounded-lg px-3 py-2 text-gym-text min-h-[44px]'

export function PlanForm({ defaultValues, onSubmit, isLoading, submitLabel }: PlanFormProps) {
  const { t } = useI18n()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      daysPerWeek: 3,
      durationWeeks: null,
      description: null,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4 pt-4 pb-24">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gym-text">{t('planNameLabel')}</label>
        <input
          {...register('name')}
          className={inputClass}
          placeholder={t('planNameLabel')}
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gym-text">{t('planGoalLabel')}</label>
        <select {...register('goal')} className={inputClass}>
          <option value="muscle-gain">{t('planGoalMuscleGain')}</option>
          <option value="fat-loss">{t('planGoalFatLoss')}</option>
          <option value="strength">{t('planGoalStrength')}</option>
          <option value="conditioning">{t('planGoalConditioning')}</option>
          <option value="general">{t('planGoalGeneral')}</option>
        </select>
        {errors.goal && <p className="text-xs text-red-400">{errors.goal.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gym-text">{t('planLevelLabel')}</label>
        <select {...register('level')} className={inputClass}>
          <option value="beginner">{t('planLevelBeginner')}</option>
          <option value="intermediate">{t('planLevelIntermediate')}</option>
          <option value="advanced">{t('planLevelAdvanced')}</option>
        </select>
        {errors.level && <p className="text-xs text-red-400">{errors.level.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gym-text">{t('planDaysPerWeekLabel')}</label>
        <input
          {...register('daysPerWeek', { valueAsNumber: true })}
          type="number"
          min={1}
          max={7}
          className={inputClass}
        />
        {errors.daysPerWeek && <p className="text-xs text-red-400">{errors.daysPerWeek.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gym-text">{t('planDurationLabel')}</label>
        <input
          {...register('durationWeeks', {
            setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
          })}
          type="number"
          min={1}
          max={52}
          className={inputClass}
        />
        {errors.durationWeeks && (
          <p className="text-xs text-red-400">{errors.durationWeeks.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gym-text">{t('planDescriptionLabel')}</label>
        <textarea
          {...register('description', {
            setValueAs: (v) => (v === '' ? null : v),
          })}
          rows={3}
          className={inputClass}
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="glow-accent h-11 w-full rounded-lg bg-gym-accent font-semibold text-white disabled:opacity-50"
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          submitLabel ?? t('newPlan')
        )}
      </button>
    </form>
  )
}
