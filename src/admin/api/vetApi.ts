import { apiClient } from '../../shared/api/apiClient'

export interface VetProfile {
  id: number
  name: string
  email: string
  matricula: string
  slug: string
  specialty: string | null
  address: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
}

export interface VetLocationRequest {
  address: string
  city: string
  latitude: number
  longitude: number
}

export const vetApi = {
  getMyProfile: () => apiClient.get<VetProfile>('/vet/my-profile'),

  updateLocation: (data: VetLocationRequest) =>
    apiClient.put<VetProfile>('/vet/location', data),
}
