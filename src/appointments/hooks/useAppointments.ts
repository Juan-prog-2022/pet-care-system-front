import { useEffect, useState } from 'react'
import { appointmentApi } from '../api/appointmentApi'
import type { Appointment, AppointmentStatus } from '../types/appointment'
import { ApiError } from '../../shared/api/apiClient'

export function useMyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = () => {
    setLoading(true)
    setError(null)
    appointmentApi
      .getMyAppointments()
      .then(setAppointments)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Error al cargar turnos')
      })
      .finally(() => setLoading(false))
  }

  useEffect(fetch, [])

  return { appointments, loading, error, refetch: fetch }
}

export const statusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
  NO_SHOW: { label: 'No asistió', color: 'bg-gray-100 text-gray-700' },
}
