import { apiClient } from '../../shared/api/apiClient'
import type { VeterinarianResponse } from '../types/veterinarian'

export const adminApi = {
  getPendingVeterinarians: () =>
    apiClient.get<VeterinarianResponse[]>('/admin/veterinarians/pending'),

  approveVeterinarian: (id: number) =>
    apiClient.put<VeterinarianResponse>(`/admin/veterinarians/${id}/approve`),

  rejectVeterinarian: (id: number) =>
    apiClient.delete<void>(`/admin/veterinarians/${id}/reject`),
}
