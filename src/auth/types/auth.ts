import type { User } from '../../shared/types/user'

export interface AuthResponse {
  token: string | null
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: 'CUSTOMER' | 'VETERINARIAN'
  matricula?: string
  slug?: string
}