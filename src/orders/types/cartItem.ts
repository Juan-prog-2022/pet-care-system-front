import type { Product } from '../../products/types/product'

export interface CartItem {
  id: number
  product: Product
  quantity: number
}