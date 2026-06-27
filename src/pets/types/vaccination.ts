export interface Vaccination {
  id: number
  petId: number
  vaccineName: string
  applicationDate: string
  nextDoseDate?: string
}