import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { appointmentApi } from '../api/appointmentApi'
import { scheduleApi } from '../api/scheduleApi'
import { petApi } from '../../pets/api/petApi'
import type { Pet } from '../../pets/types/pet'
import type { AvailableVet, AvailableSlot } from '../types/schedule'
import { ApiError } from '../../shared/api/apiClient'
import { Loader2 } from 'lucide-react'

interface AppointmentForm {
  petId: string
  veterinarianId: string
  date: string
  time: string
  reason: string
}

export function CreateAppointmentPage() {
  const navigate = useNavigate()
  const [pets, setPets] = useState<Pet[]>([])
  const [vets, setVets] = useState<AvailableVet[]>([])
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentForm>()

  const selectedVet = watch('veterinarianId')
  const selectedDate = watch('date')

  useEffect(() => {
    petApi.getMyPets().then(setPets).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedDate) {
      scheduleApi.getAvailableVets(selectedDate).then(setVets).catch(() => {})
    }
  }, [selectedDate])

  useEffect(() => {
    if (selectedVet && selectedDate) {
      setLoadingSlots(true)
      scheduleApi.getAvailableSlots(Number(selectedVet), selectedDate)
        .then(setSlots)
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false))
    } else {
      setSlots([])
    }
  }, [selectedVet, selectedDate])

  const onSubmit: SubmitHandler<AppointmentForm> = async (data) => {
    try {
      setError(null)
      const dateTime = new Date(`${data.date}T${data.time}`).toISOString()
      await appointmentApi.createMyAppointment({
        petId: Number(data.petId),
        veterinarianId: data.veterinarianId ? Number(data.veterinarianId) : undefined,
        dateTime,
        reason: data.reason || undefined,
      })
      toast.success('Turno agendado correctamente')
      navigate('/appointments')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al crear turno')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Nuevo Turno</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md rounded-xl bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Mascota</label>
          <select
            {...register('petId', { required: 'Seleccioná una mascota' })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.species.toLowerCase()})
              </option>
            ))}
          </select>
          {errors.petId && (
            <p className="mt-1 text-xs text-red-500">{errors.petId.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            min={today}
            {...register('date', { required: 'La fecha es obligatoria' })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
          )}
        </div>

        {selectedDate && vets.length > 0 && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Veterinario</label>
            <select
              {...register('veterinarianId')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              {vets.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}{v.specialty ? ` (${v.specialty})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {loadingSlots && (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando horarios...
          </div>
        )}

        {!loadingSlots && slots.length > 0 && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Horario</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((slot) => {
                const time = slot.time.substring(0, 5)
                return (
                  <label
                    key={time}
                    className={`flex cursor-pointer items-center justify-center rounded-lg border p-2 text-sm transition ${
                      !slot.available
                        ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                        : 'border-blue-200 hover:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-100 has-[:checked]:font-semibold'
                    }`}
                  >
                    <input
                      type="radio"
                      value={time}
                      disabled={!slot.available}
                      {...register('time', { required: 'Seleccioná un horario' })}
                      className="sr-only"
                    />
                    {time}
                  </label>
                )
              })}
            </div>
            {errors.time && (
              <p className="mt-1 text-xs text-red-500">{errors.time.message}</p>
            )}
          </div>
        )}

        {selectedDate && !loadingSlots && selectedVet && slots.length === 0 && (
          <p className="mb-4 text-sm text-gray-400">
            No hay horarios disponibles para esta fecha.
          </p>
        )}

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Motivo</label>
          <textarea
            rows={3}
            {...register('reason')}
            placeholder="Ej: Vacunación antirrábica"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Agendando...' : 'Agendar turno'}
          </button>
        </div>
      </form>
    </div>
  )
}
