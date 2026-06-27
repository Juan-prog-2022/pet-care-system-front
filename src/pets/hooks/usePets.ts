import { useEffect, useState } from 'react'
import { petApi } from '../api/petApi'
import type { Pet } from '../types/pet'
import { ApiError } from '../../shared/api/apiClient'

export function useMyPets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    petApi
      .getMyPets()
      .then(setPets)
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : 'Error al cargar mascotas'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [])

  return { pets, loading, error }
}
