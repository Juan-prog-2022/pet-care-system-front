import { apiClient } from '../../shared/api/apiClient'

export interface ReportRow {
  [key: string]: string | number | null
}

export const reportsApi = {
  getAdminAppointments: (start?: string, end?: string) => {
    const params = new URLSearchParams()
    if (start) params.set('startDate', start)
    if (end) params.set('endDate', end)
    return apiClient.get<ReportRow[]>(`/admin/reports/appointments?${params}`)
  },

  getAdminSales: (start?: string, end?: string) => {
    const params = new URLSearchParams()
    if (start) params.set('startDate', start)
    if (end) params.set('endDate', end)
    return apiClient.get<ReportRow[]>(`/admin/reports/sales?${params}`)
  },

  getMyAppointments: (start?: string, end?: string) => {
    const params = new URLSearchParams()
    if (start) params.set('startDate', start)
    if (end) params.set('endDate', end)
    return apiClient.get<ReportRow[]>(`/reports/my/appointments?${params}`)
  },
}
