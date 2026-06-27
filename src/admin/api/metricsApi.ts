import { apiClient } from '../../shared/api/apiClient'

export interface MonthlyCount {
  month: string
  count: number
}

export interface MonthlyTotal {
  month: string
  total: number
}

export interface DashboardMetrics {
  totalUsers: number
  totalVeterinarians: number
  totalProducts: number
  totalAppointments: number
  totalOrders: number
  totalRevenue: number
  appointmentsByMonth: MonthlyCount[]
  salesByMonth: MonthlyTotal[]
}

export const metricsApi = {
  getDashboard: () =>
    apiClient.get<DashboardMetrics>('/admin/metrics/dashboard'),
}
