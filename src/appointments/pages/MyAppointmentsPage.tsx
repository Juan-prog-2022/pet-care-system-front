import { Link } from 'react-router-dom'
import { Plus, Calendar } from 'lucide-react'
import { useMyAppointments, statusConfig } from '../hooks/useAppointments'

export function MyAppointmentsPage() {
  const { appointments, loading, error } = useMyAppointments()

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mis Turnos</h1>
        <Link
          to="/appointments/new"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo turno
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl bg-white py-20 text-center">
          <Calendar className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No tenés turnos agendados.</p>
          <Link
            to="/appointments/new"
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Agendá tu primer turno
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const { label, color } = statusConfig[apt.status]
            return (
              <div
                key={apt.id}
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{apt.petName}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(apt.dateTime)} · {formatTime(apt.dateTime)}
                  </p>
                  {apt.veterinarianName && (
                    <p className="text-xs text-blue-500">Vet: {apt.veterinarianName}</p>
                  )}
                  {apt.reason && (
                    <p className="mt-0.5 text-xs text-gray-400">{apt.reason}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
