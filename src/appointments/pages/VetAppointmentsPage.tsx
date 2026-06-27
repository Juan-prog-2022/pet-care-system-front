import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { appointmentApi } from '../api/appointmentApi'
import type { Appointment, AppointmentStatus } from '../types/appointment'
import { ApiError } from '../../shared/api/apiClient'

type Tab = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

const tabs: { key: Tab; label: string }[] = [
  { key: 'PENDING', label: 'Pendientes' },
  { key: 'CONFIRMED', label: 'Confirmados' },
  { key: 'COMPLETED', label: 'Completados' },
  { key: 'CANCELLED', label: 'Cancelados' },
]

export function VetAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('PENDING')

  const fetch = () => {
    setLoading(true)
    setError(null)
    appointmentApi
      .getAll()
      .then(setAppointments)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Error al cargar turnos')
      })
      .finally(() => setLoading(false))
  }

  useEffect(fetch, [])

  const statusLabels: Record<string, string> = {
    CONFIRMED: 'confirmado',
    CANCELLED: 'cancelado',
    COMPLETED: 'completado',
    NO_SHOW: 'marcado como no asistió',
  }

  const changeStatus = async (id: number, newStatus: AppointmentStatus) => {
    try {
      await appointmentApi.updateStatus(id, newStatus)
      toast.success(`Turno ${statusLabels[newStatus] ?? 'actualizado'} correctamente`)
      fetch()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al actualizar')
    }
  }

  const filtered = appointments.filter((a) => a.status === activeTab)

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

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Gestión de Turnos</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              activeTab === key
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label} ({appointments.filter((a) => a.status === key).length})
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="py-20 text-center text-gray-500">
          No hay turnos {activeTab === 'PENDING' ? 'pendientes' : activeTab.toLowerCase()}s.
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{apt.petName}</h3>
                  <span className="text-xs text-gray-400">· Dueño: {apt.customerName}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(apt.dateTime)} · {formatTime(apt.dateTime)}
                </p>
                {apt.reason && (
                  <p className="mt-0.5 text-xs text-gray-400">{apt.reason}</p>
                )}
              </div>

              <div className="flex gap-2">
                {apt.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => changeStatus(apt.id, 'CONFIRMED')}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => changeStatus(apt.id, 'CANCELLED')}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {apt.status === 'CONFIRMED' && (
                  <>
                    <button
                      onClick={() => changeStatus(apt.id, 'COMPLETED')}
                      className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      Completar
                    </button>
                    <button
                      onClick={() => changeStatus(apt.id, 'NO_SHOW')}
                      className="rounded-lg bg-gray-600 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700"
                    >
                      No asistió
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
