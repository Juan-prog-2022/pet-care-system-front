export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'

export interface Appointment {
  id: number
  customerId: number
  customerName: string
  petId: number
  petName: string
  veterinarianId?: number | null
  veterinarianName?: string | null
  dateTime: string
  reason: string
  status: AppointmentStatus
}
