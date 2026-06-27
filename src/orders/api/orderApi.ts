import { apiClient } from '../../shared/api/apiClient'
import type { Order } from '../types/order'

export interface OrderItemInput {
  productId: number
  quantity: number
}

export const orderApi = {
  getMyOrders: () =>
    apiClient.get<Order[]>('/orders/my-orders'),

  createMyOrder: (items: OrderItemInput[]) =>
    apiClient.post<Order>('/orders/my-orders', { items }),
}
