'use client'

import { useState, useEffect } from 'react'
import type { WeightUnit } from '../types'

const STORAGE_KEY = 'gym-planner:weight-unit'
const CHANGE_EVENT = 'gym-planner:unit-change'

function readUnit(): WeightUnit {
  if (typeof window === 'undefined') return 'kg'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'lbs' ? 'lbs' : 'kg'
}

export function useWeightUnitPreference(): [WeightUnit, (u: WeightUnit) => void] {
  const [unit, setUnit] = useState<WeightUnit>(readUnit)

  useEffect(() => {
    const sync = () => setUnit(readUnit())
    window.addEventListener(CHANGE_EVENT, sync)
    return () => window.removeEventListener(CHANGE_EVENT, sync)
  }, [])

  function saveUnit(u: WeightUnit) {
    localStorage.setItem(STORAGE_KEY, u)
    window.dispatchEvent(new Event(CHANGE_EVENT))
    setUnit(u)
  }

  return [unit, saveUnit]
}
