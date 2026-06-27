export type PetSpecies = 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'RODENT' | 'REPTILE' | 'OTHER'

export type DogBreed =
  | 'LABRADOR' | 'GERMAN_SHEPHERD' | 'BULLDOG' | 'POODLE'
  | 'BEAGLE' | 'ROTTWEILER' | 'YORKSHIRE' | 'BOXER'
  | 'DACHSHUND' | 'MIXED'

export type Gender = 'MALE' | 'FEMALE'

export interface Pet {
  id: number
  name: string
  species: PetSpecies
  breed?: DogBreed | null
  gender?: Gender | null
  birthDate?: string | null
  color?: string | null
  weight?: number | null
  notes?: string | null
  photoUrl?: string | null
  customerId: number
  customerName: string
}
