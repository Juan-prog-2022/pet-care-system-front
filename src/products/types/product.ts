import type { ProductCategory } from './productCategory'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: ProductCategory
  imageUrl?: string | null
}
