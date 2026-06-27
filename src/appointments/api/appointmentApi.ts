import { apiClient } from '../../shared/api/apiClient'
import type { Appointment } from '../types/appointment'

export interface CreateAppointmentRequest {
  petId: number
  veterinarianId?: number
  dateTime: string
  reason?: string
}

export const appointmentApi = {
  getMyAppointments: () =>
    apiClient.get<Appointment[]>('/appointments/my-appointments'),

  createMyAppointment: (data: CreateAppointmentRequest) =>
    apiClient.post<Appointment>('/appointments/my-appointments', data),

  getAll: () =>
    apiClient.get<Appointment[]>('/appointments'),

  updateStatus: (id: number, status: string) =>
    apiClient.patch<Appointment>(`/appointments/${id}/status`, { status }),
}
