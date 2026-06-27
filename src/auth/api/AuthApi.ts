import { apiClient } from '../../shared/api/apiClient'

import type { User } from '../../shared/types/user'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types/auth'

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  me: () =>
    apiClient.get<User>('/auth/me'),

  logout: () =>
    apiClient.post<void>('/auth/logout'),
}