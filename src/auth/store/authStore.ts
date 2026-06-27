import { create } from 'zustand'
import { authApi } from '../api/AuthApi'
import { tokenService } from '../../shared/utils/tokenService'
import { ApiError } from '../../shared/api/apiClient'
import type { User } from '../../shared/types/user'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<AuthResponse | null>
  logout: () => void
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    const token = tokenService.get()
    if (!token) {
      set({ loading: false })
      return
    }
    try {
      const user = await authApi.me()
      set({ user, loading: false })
    } catch {
      tokenService.remove()
      set({ user: null, loading: false })
    }
  },

  login: async (credentials: LoginRequest) => {
    set({ error: null })
    try {
      const response = await authApi.login(credentials)
      tokenService.set(response.token!)
      set({ user: response.user })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error de conexión'
      set({ error: message })
      throw err
    }
  },

  register: async (data: RegisterRequest) => {
    set({ error: null })
    try {
      const response = await authApi.register(data)
      if (response.token) {
        tokenService.set(response.token)
        set({ user: response.user })
      }
      return response
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error de conexión'
      set({ error: message })
      throw err
    }
  },

  logout: () => {
    tokenService.remove()
    set({ user: null, error: null })
  },

  clearError: () => set({ error: null }),
}))
