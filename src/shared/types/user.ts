export type UserRole =
  | 'CUSTOMER'
  | 'VETERINARIAN'
  | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  createdAt?: string
}