import { useEffect, useState } from 'react'
import { productApi } from '../api/productApi'
import type { Product } from '../types/product'
import type { ProductCategory } from '../types/productCategory'
import { ApiError } from '../../shared/api/apiClient'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    productApi
      .getAll()
      .then(setProducts)
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : 'Error al cargar productos'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}

export function useProductById(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    productApi
      .getById(id)
      .then(setProduct)
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : 'Error al cargar producto'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading, error }
}

export function useProductFilters(products: Product[]) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | ''>('')

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !category || p.category === category
    return matchesSearch && matchesCategory
  })

  return { filtered, search, setSearch, category, setCategory }
}
