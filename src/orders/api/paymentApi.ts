import { apiClient } from '../../shared/api/apiClient'

export interface CreatePreferenceResponse {
  preferenceId: string
  checkoutUrl: string
}

export const paymentApi = {
  createPreference: (orderId: number) =>
    apiClient.post<CreatePreferenceResponse>(`/payments/create-preference/${orderId}`),
}
