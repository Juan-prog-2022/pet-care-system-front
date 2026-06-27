import { apiClient } from '../../shared/api/apiClient'
import type { VetSchedule, AvailableVet, AvailableSlot } from '../types/schedule'

export const scheduleApi = {
  getMySchedules: () =>
    apiClient.get<VetSchedule[]>('/schedules/my-schedules'),

  updateMySchedules: (schedules: Omit<VetSchedule, 'id'>[]) =>
    apiClient.put<VetSchedule[]>('/schedules/my-schedules', schedules),

  getAvailableVets: (date: string) =>
    apiClient.get<AvailableVet[]>(`/schedules/available-vets?date=${date}`),

  getAvailableSlots: (vetId: number, date: string) =>
    apiClient.get<AvailableSlot[]>(`/schedules/available-slots?vetId=${vetId}&date=${date}`),
}
