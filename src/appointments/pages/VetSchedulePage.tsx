import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { scheduleApi } from '../api/scheduleApi'
import { Clock, Save, Loader2, Plus, Trash2 } from 'lucide-react'

const DAYS = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
]

const dayLabels: Record<string, string> = {
  MONDAY: 'Lunes', TUESDAY: 'Martes', WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves', FRIDAY: 'Viernes', SATURDAY: 'Sábado', SUNDAY: 'Domingo',
}

interface ScheduleEntry {
  dayOfWeek: string
  startTime: string
  endTime: string
}

export function VetSchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    scheduleApi.getMySchedules()
      .then((data) => {
        setSchedules(data.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime.substring(0, 5),
          endTime: s.endTime.substring(0, 5),
        })))
      })
      .catch(() => toast.error('Error al cargar horarios'))
      .finally(() => setLoading(false))
  }, [])

  const addDay = (day: string) => {
    setSchedules((prev) => [...prev, { dayOfWeek: day, startTime: '09:00', endTime: '17:00' }])
  }

  const removeDay = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: string, value: string) => {
    setSchedules((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await scheduleApi.updateMySchedules(
        schedules.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime + ':00',
          endTime: s.endTime + ':00',
        }))
      )
      toast.success('Horarios guardados correctamente')
    } catch {
      toast.error('Error al guardar horarios')
    } finally {
      setSaving(false)
    }
  }

  const daysWithSchedule = new Set(schedules.map((s) => s.dayOfWeek))

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Mis Horarios</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          {DAYS.filter((d) => !daysWithSchedule.has(d)).map((day) => (
            <button
              key={day}
              onClick={() => addDay(day)}
              className="flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-3 w-3" />
              {dayLabels[day]}
            </button>
          ))}
        </div>

        {schedules.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No configuraste ningún horario. Agregá un día para empezar.
          </p>
        ) : (
          <div className="space-y-2">
            {schedules
              .sort((a, b) => DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek))
              .map((entry, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3 sm:flex-nowrap sm:gap-3">
                  <span className="w-full text-sm font-medium text-gray-700 sm:w-24">
                    {dayLabels[entry.dayOfWeek]}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={entry.startTime}
                      onChange={(e) => updateEntry(i, 'startTime', e.target.value)}
                      className="rounded border px-2 py-1 text-sm"
                    />
                    <span className="text-gray-400">a</span>
                    <input
                      type="time"
                      value={entry.endTime}
                      onChange={(e) => updateEntry(i, 'endTime', e.target.value)}
                      className="rounded border px-2 py-1 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeDay(i)}
                    className="ml-auto text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {schedules.length > 0 && (
        <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
          <p className="font-medium">Los turnos se generan cada 30 minutos dentro del horario configurado.</p>
          <p className="mt-1 text-blue-500">Los clientes podrán ver tu disponibilidad al agendar un turno.</p>
        </div>
      )}
    </div>
  )
}
