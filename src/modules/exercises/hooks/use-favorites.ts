'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getFavorites, addFavorite, removeFavorite } from '../services/favorites'

function useUserId() {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data } = await createClient().auth.getUser()
      return data.user?.id ?? null
    },
    staleTime: Infinity,
  })
}

export function useFavorites() {
  const queryClient = useQueryClient()
  const { data: userId } = useUserId()

  const { data: favoritesArray, isLoading } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })

  const favorites = new Set(favoritesArray ?? [])

  const mutation = useMutation({
    mutationFn: ({
      exerciseId,
      isFavorite,
    }: {
      exerciseId: string
      isFavorite: boolean
    }) =>
      isFavorite
        ? removeFavorite(userId!, exerciseId)
        : addFavorite(userId!, exerciseId),
    onMutate: async ({ exerciseId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', userId] })
      const snapshot = queryClient.getQueryData<string[]>(['favorites', userId])
      queryClient.setQueryData<string[]>(['favorites', userId], (prev = []) =>
        isFavorite ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId],
      )
      return { snapshot }
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData(['favorites', userId], context.snapshot)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
    },
  })

  return {
    favorites,
    toggle: (exerciseId: string) =>
      mutation.mutate({ exerciseId, isFavorite: favorites.has(exerciseId) }),
    isLoading,
    error: mutation.error ? String(mutation.error) : null,
  }
}
