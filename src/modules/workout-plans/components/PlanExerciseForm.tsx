'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planExerciseFormSchema, type PlanExerciseFormValues } from '../validation/plan-schema'
import { useI18n } from '@/i18n/client'

interface PlanExerciseFormProps {
  defaultValues?: Partial<PlanExerciseFormValues>
  onSubmit: (v: PlanExerciseFormValues) => void
  onCancel: () => void
  isLoading: boolean
}

const inputClass =
  'w-full bg-gym-surface-2 border border-gym-border rounded-lg px-3 py-2 text-gym-text min-h-[44px]'

function asNumber(v: string): number | null {
  return v === '' ? null : Number(v)
}

export function PlanExerciseForm({ defaultValues, onSubmit, onCancel, isLoading }: PlanExerciseFormProps) {
  const { t } = useI18n()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanExerciseFormValues>({
    resolver: zodResolver(planExerciseFormSchema),
    defaultValues: {
      targetSets: null,
      targetReps: null,
      targetRepRangeMin: null,
      targetRepRangeMax: null,
      targetWeight: null,
      restSeconds: null,
      notes: null,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 px-4 py-3 bg-gym-surface-2 rounded-lg">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gym-muted">{t('planExerciseTargetSets')}</label>
          <input
            {...register('targetSets', { setValueAs: asNumber })}
            type="number"
            min={1}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gym-muted">{t('planExerciseTargetReps')}</label>
          <input
            {...register('targetReps', { setValueAs: asNumber })}
            type="number"
            min={1}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gym-muted">Rep range min</label>
          <input
            {...register('targetRepRangeMin', { setValueAs: asNumber })}
            type="number"
            min={1}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gym-muted">Rep range max</label>
          <input
            {...register('targetRepRangeMax', { setValueAs: asNumber })}
            type="number"
            min={1}
            className={inputClass}
          />
        </div>
      </div>

      {errors.targetRepRangeMin && (
        <p className="text-xs text-red-400">{errors.targetRepRangeMin.message}</p>
      )}

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gym-muted">{t('planExerciseTargetWeight')}</label>
          <input
            {...register('targetWeight', { setValueAs: asNumber })}
            type="number"
            min={0}
            step={0.5}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gym-muted">{t('planExerciseRest')}</label>
          <input
            {...register('restSeconds', { setValueAs: asNumber })}
            type="number"
            min={0}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gym-muted">{t('planExerciseNotes')}</label>
        <textarea
          {...register('notes', { setValueAs: (v) => (v === '' ? null : v) })}
          rows={2}
          className={inputClass}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-11 rounded-lg bg-gym-accent text-white font-semibold text-sm disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-lg border border-gym-border text-gym-text text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
