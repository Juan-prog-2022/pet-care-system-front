import { useEffect, useState } from 'react'
import { orderApi } from '../api/orderApi'
import type { Order, OrderStatus } from '../types/order'
import { ApiError } from '../../shared/api/apiClient'

export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then(setOrders)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Error al cargar órdenes')
      })
      .finally(() => setLoading(false))
  }, [])

  return { orders, loading, error }
}

export const orderStatusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
}

export const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  APPROVED: { label: 'Pagado', color: 'bg-green-100 text-green-700' },
  PENDING: { label: 'Pago pendiente', color: 'bg-yellow-100 text-yellow-700' },
  REJECTED: { label: 'Rechazado', color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-700' },
}
