'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { setInputSchema, type SetInputSchema } from '../validation/set-log.schema'
import { useWeightUnitPreference } from '../hooks/use-weight-unit-preference'
import type { SetType, WeightUnit } from '../types'

interface SetLogFormProps {
  onSubmit: (values: SetInputSchema) => void | Promise<void>
  defaultValues?: Partial<SetInputSchema>
  submitLabel?: string
}

const SET_TYPES: { value: SetType; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'warmup', label: 'Warm-up' },
  { value: 'dropset', label: 'Drop Set' },
]

const WEIGHT_UNITS: WeightUnit[] = ['kg', 'lbs']

export function SetLogForm({ onSubmit, defaultValues, submitLabel = 'Add Set' }: SetLogFormProps) {
  const [preferredUnit, saveUnit] = useWeightUnitPreference()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SetInputSchema>({
    resolver: zodResolver(setInputSchema),
    defaultValues: {
      weightUnit: preferredUnit,
      setType: 'normal',
      ...defaultValues,
    },
  })

  const watchedUnit = watch('weightUnit')
  useEffect(() => {
    if (watchedUnit) saveUnit(watchedUnit as WeightUnit)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedUnit])

  async function handleValidSubmit(values: SetInputSchema) {
    await onSubmit(values)
    reset({ weightUnit: values.weightUnit, setType: values.setType })
  }

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-3 p-3">
      <div className="flex gap-2">
        {/* Weight */}
        <div className="flex flex-1 flex-col gap-1">
          <input
            {...register('weight', { valueAsNumber: true })}
            type="number"
            inputMode="decimal"
            placeholder="Weight"
            className="h-11 w-full rounded border border-gym-border bg-gym-surface px-3 text-sm"
          />
          {errors.weight && (
            <p className="text-xs text-red-400">{errors.weight.message}</p>
          )}
        </div>

        {/* Unit */}
        <select
          {...register('weightUnit')}
          className="h-11 rounded border border-gym-border bg-gym-surface px-2 text-sm"
        >
          {WEIGHT_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        {/* Reps */}
        <div className="flex flex-col gap-1">
          <input
            {...register('reps', { valueAsNumber: true })}
            type="number"
            inputMode="numeric"
            placeholder="Reps"
            className="h-11 w-20 rounded border border-gym-border bg-gym-surface px-3 text-sm"
          />
          {errors.reps && (
            <p className="text-xs text-red-400">{errors.reps.message}</p>
          )}
        </div>
      </div>

      {/* Set type */}
      <div className="flex gap-2">
        {SET_TYPES.map(({ value, label }) => (
          <label
            key={value}
            className="flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded border border-gym-border text-sm has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/10"
          >
            <input {...register('setType')} type="radio" value={value} className="sr-only" />
            {label}
          </label>
        ))}
      </div>

      {/* RPE (optional) */}
      <div className="flex flex-col gap-1">
        <input
          {...register('rpe', { valueAsNumber: true, setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
          type="number"
          inputMode="decimal"
          placeholder="RPE (optional, 1–10)"
          min={1}
          max={10}
          step={0.5}
          className="h-11 w-full rounded border border-gym-border bg-gym-surface px-3 text-sm"
        />
        {errors.rpe && (
          <p className="text-xs text-red-400">{errors.rpe.message}</p>
        )}
      </div>

      {/* Notes (optional) */}
      <input
        {...register('notes')}
        type="text"
        placeholder="Notes (optional)"
        className="h-11 w-full rounded border border-gym-border bg-gym-surface px-3 text-sm"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  )
}
