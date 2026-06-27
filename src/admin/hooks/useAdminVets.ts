import { useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'
import type { VeterinarianResponse } from '../types/veterinarian'
import { ApiError } from '../../shared/api/apiClient'

export function usePendingVeterinarians() {
  const [vets, setVets] = useState<VeterinarianResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = () => {
    setLoading(true)
    setError(null)
    adminApi
      .getPendingVeterinarians()
      .then(setVets)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Error al cargar veterinarios')
      })
      .finally(() => setLoading(false))
  }

  useEffect(fetch, [])

  const approve = async (id: number) => {
    await adminApi.approveVeterinarian(id)
    setVets((prev) => prev.filter((v) => v.id !== id))
  }

  const reject = async (id: number) => {
    await adminApi.rejectVeterinarian(id)
    setVets((prev) => prev.filter((v) => v.id !== id))
  }

  return { vets, loading, error, approve, reject, refetch: fetch }
}
