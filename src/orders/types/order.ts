export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'

export interface OrderItemResponse {
  productId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export interface Order {
  id: number
  customerId: number
  customerName: string
  createdAt: string
  total: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED' | null
  mpPreferenceId: string | null
  mpPaymentId: string | null
  items: OrderItemResponse[]
}
