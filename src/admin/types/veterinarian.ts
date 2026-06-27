export interface VeterinarianResponse {
  id: number
  name: string
  email: string
  matricula: string
  slug: string | null
  specialty: string | null
  approved: boolean
  createdAt: string
}
