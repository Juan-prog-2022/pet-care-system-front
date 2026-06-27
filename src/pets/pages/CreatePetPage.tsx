import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { petApi } from '../api/petApi'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { ImagePicker } from '../../shared/components/ImagePicker'
import type { PetSpecies, DogBreed, Gender } from '../types/pet'

type SpeciesConfig = {
  label: string
  breeds?: { value: DogBreed; label: string }[]
}

const speciesOptions: Record<PetSpecies, SpeciesConfig> = {
  DOG: {
    label: 'Perro',
    breeds: [
      { value: 'LABRADOR', label: 'Labrador' },
      { value: 'GERMAN_SHEPHERD', label: 'Pastor Alemán' },
      { value: 'BULLDOG', label: 'Bulldog' },
      { value: 'POODLE', label: 'Caniche' },
      { value: 'BEAGLE', label: 'Beagle' },
      { value: 'ROTTWEILER', label: 'Rottweiler' },
      { value: 'YORKSHIRE', label: 'Yorkshire' },
      { value: 'BOXER', label: 'Bóxer' },
      { value: 'DACHSHUND', label: 'Dachshund' },
      { value: 'MIXED', label: 'Mestizo' },
    ],
  },
  CAT: { label: 'Gato' },
  BIRD: { label: 'Pájaro' },
  FISH: { label: 'Pez' },
  RODENT: { label: 'Roedor' },
  REPTILE: { label: 'Reptil' },
  OTHER: { label: 'Otro' },
}

export function CreatePetPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditing = Boolean(id)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    species: '' as PetSpecies | '',
    breed: '',
    gender: '' as Gender | '',
    birthDate: '',
    color: '',
    weight: '',
    notes: '',
    photoUrl: '',
  })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    petApi.getById(Number(id)).then((pet) => {
      setForm({
        name: pet.name,
        species: pet.species,
        breed: pet.breed || '',
        gender: pet.gender || '',
        birthDate: pet.birthDate || '',
        color: pet.color || '',
        weight: pet.weight?.toString() || '',
        notes: pet.notes || '',
        photoUrl: pet.photoUrl || '',
      })
    }).catch(() => {
      setError('Error al cargar la mascota')
    }).finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'species' && value !== 'DOG') next.breed = ''
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        name: form.name,
        species: form.species as PetSpecies,
        breed: form.breed || null,
        gender: (form.gender || null) as Gender | null,
        birthDate: form.birthDate || null,
        color: form.color || null,
        weight: form.weight ? Number(form.weight) : null,
        notes: form.notes || null,
        photoUrl: form.photoUrl || null,
      }

      if (isEditing && id) {
        await petApi.updateMyPet(Number(id), payload)
        toast.success(`${form.name} actualizada correctamente`)
      } else {
        await petApi.createMyPet(payload)
        toast.success(`${form.name} registrada correctamente`)
      }
      navigate('/pets')
    } catch {
      setError('Error al guardar la mascota. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <button
        onClick={() => navigate('/pets')}
        className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis mascotas
      </button>

      <h1 className="mb-6 text-2xl font-bold text-gray-800">{isEditing ? 'Editar mascota' : 'Nueva mascota'}</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
          <input
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Ej: Firulais"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Especie *</label>
            <select
              required
              value={form.species}
              onChange={(e) => handleChange('species', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Seleccionar</option>
              {(Object.entries(speciesOptions) as [PetSpecies, SpeciesConfig][]).map(
                ([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                )
              )}
            </select>
          </div>

          {form.species === 'DOG' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Raza</label>
              <select
                value={form.breed}
                onChange={(e) => handleChange('breed', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar</option>
                {speciesOptions.DOG.breeds!.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sexo</label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Seleccionar</option>
              <option value="MALE">Macho</option>
              <option value="FEMALE">Hembra</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Fecha de nac.
            </label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Color</label>
            <input
              value={form.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Ej: Marrón"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Ej: 12.5"
            />
          </div>
        </div>

        <ImagePicker
          query={[form.species, form.color].filter(Boolean).join(' ')}
          onSelect={(img) => handleChange('photoUrl', img.url)}
          selectedUrl={form.photoUrl}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
          <textarea
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Alergias, cuidados especiales..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar mascota
        </button>
      </form>
      )}
    </div>
  )
}
