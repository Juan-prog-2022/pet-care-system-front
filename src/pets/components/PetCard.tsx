import { Dog, Cat, Bird, Fish, Rat, Tent, HelpCircle, Heart } from 'lucide-react'
import type { Pet, PetSpecies } from '../types/pet'

const speciesConfig: Record<PetSpecies, { color: string; icon: typeof Dog }> = {
  DOG: { color: 'bg-blue-100 text-blue-600', icon: Dog },
  CAT: { color: 'bg-orange-100 text-orange-600', icon: Cat },
  BIRD: { color: 'bg-yellow-100 text-yellow-600', icon: Bird },
  FISH: { color: 'bg-cyan-100 text-cyan-600', icon: Fish },
  RODENT: { color: 'bg-gray-100 text-gray-600', icon: Rat },
  REPTILE: { color: 'bg-green-100 text-green-600', icon: Tent },
  OTHER: { color: 'bg-purple-100 text-purple-600', icon: HelpCircle },
}

interface Props {
  pet: Pet
}

export function PetCard({ pet }: Props) {
  const { color, icon: Icon } = speciesConfig[pet.species]
  const age = pet.birthDate
    ? Math.floor(
        (Date.now() - new Date(pet.birthDate).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
      {pet.photoUrl ? (
        <img src={pet.photoUrl} alt={pet.name} className="h-14 w-14 rounded-full object-cover" />
      ) : (
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}>
          <Icon className="h-7 w-7" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{pet.name}</h3>
        <p className="text-xs text-gray-500">
          {pet.species === 'DOG' && pet.breed ? breedLabel(pet.breed) : pet.species.toLowerCase()}
          {age !== null ? ` · ${age} año${age !== 1 ? 's' : ''}` : ''}
        </p>
        {pet.color && (
          <span className="text-xs text-gray-400">{pet.color}</span>
        )}
      </div>
      <Heart className="h-5 w-5 text-gray-300" />
    </div>
  )
}

function breedLabel(breed: string): string {
  const map: Record<string, string> = {
    LABRADOR: 'Labrador',
    GERMAN_SHEPHERD: 'Pastor Alemán',
    BULLDOG: 'Bulldog',
    POODLE: 'Caniche',
    BEAGLE: 'Beagle',
    ROTTWEILER: 'Rottweiler',
    YORKSHIRE: 'Yorkshire',
    BOXER: 'Bóxer',
    DACHSHUND: 'Dachshund',
    MIXED: 'Mestizo',
  }
  return map[breed] ?? breed
}
