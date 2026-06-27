import { apiClient } from '../../shared/api/apiClient'
import type { Product } from '../types/product'

export const productApi = {
  getAll: () =>
    apiClient.get<Product[]>('/products'),

  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`),
}
