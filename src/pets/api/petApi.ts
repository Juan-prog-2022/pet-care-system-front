import { apiClient } from '../../shared/api/apiClient'
import type { Pet } from '../types/pet'

export interface PetRequest {
  name: string
  species: string
  breed?: string | null
  gender?: string | null
  birthDate?: string | null
  color?: string | null
  weight?: number | null
  notes?: string | null
  photoUrl?: string | null
  customerId: number
}

export const petApi = {
  getMyPets: () =>
    apiClient.get<Pet[]>('/pets/my-pets'),

  getById: (id: number) =>
    apiClient.get<Pet>(`/pets/${id}`),

  createMyPet: (data: Omit<PetRequest, 'customerId'>) =>
    apiClient.post<Pet>('/pets/my-pets', data),

  updateMyPet: (id: number, data: Omit<PetRequest, 'customerId'>) =>
    apiClient.put<Pet>(`/pets/my-pets/${id}`, data),
}
