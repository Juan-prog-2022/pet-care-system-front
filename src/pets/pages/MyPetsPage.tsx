import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMyPets } from '../hooks/usePets'
import { PetCard } from '../components/PetCard'
import { Plus, Pencil } from 'lucide-react'

function genderLabel(g: string | null | undefined) {
  if (g === 'MALE') return 'Macho'
  if (g === 'FEMALE') return 'Hembra'
  return ''
}

function speciesLabel(s: string) {
  const map: Record<string, string> = {
    DOG: 'Perro', CAT: 'Gato', BIRD: 'Pájaro',
    FISH: 'Pez', RODENT: 'Roedor', REPTILE: 'Reptil', OTHER: 'Otro',
  }
  return map[s] ?? s
}

export function MyPetsPage() {
  const navigate = useNavigate()
  const { pets, loading, error } = useMyPets()
  const [expanded, setExpanded] = useState<number | null>(null)

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
        <h1 className="text-2xl font-bold text-gray-800">Mis Mascotas</h1>
        <button
          onClick={() => navigate('/pets/new')}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Agregar mascota
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="rounded-xl bg-white py-20 text-center">
          <p className="text-gray-500">Todavía no registraste ninguna mascota.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {pets.map((pet) => (
            <div key={pet.id}>
              <button
                onClick={() => setExpanded(expanded === pet.id ? null : pet.id)}
                className="w-full text-left"
              >
                <PetCard pet={pet} />
              </button>
              {expanded === pet.id && (
                <div className="mt-1 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {pet.species && (
                      <div>
                        <span className="font-medium text-gray-500">Especie: </span>
                        {speciesLabel(pet.species)}
                      </div>
                    )}
                    {pet.gender && (
                      <div>
                        <span className="font-medium text-gray-500">Sexo: </span>
                        {genderLabel(pet.gender)}
                      </div>
                    )}
                    {pet.color && (
                      <div>
                        <span className="font-medium text-gray-500">Color: </span>
                        {pet.color}
                      </div>
                    )}
                    {pet.weight && (
                      <div>
                        <span className="font-medium text-gray-500">Peso: </span>
                        {pet.weight} kg
                      </div>
                    )}
                    {pet.breed && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-500">Raza: </span>
                        {pet.breed}
                      </div>
                    )}
                    {pet.notes && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-500">Notas: </span>
                        {pet.notes}
                      </div>
                    )}
                    <div className="col-span-2 mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/pets/edit/${pet.id}`) }}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-3 w-3" />
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
