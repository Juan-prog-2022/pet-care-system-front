export interface VetSchedule {
  id: number
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface AvailableVet {
  id: number
  name: string
  specialty: string
}

export interface AvailableSlot {
  time: string
  available: boolean
}
