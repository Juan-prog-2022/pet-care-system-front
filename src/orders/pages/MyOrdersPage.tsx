import { Package } from 'lucide-react'
import { useMyOrders, orderStatusConfig, paymentStatusConfig } from '../hooks/useOrders'

export function MyOrdersPage() {
  const { orders, loading, error } = useMyOrders()

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Mis Órdenes</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl bg-white py-20 text-center">
          <Package className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No tenés órdenes de compra.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const { label, color } = orderStatusConfig[order.status]
            const pay = order.paymentStatus ? paymentStatusConfig[order.paymentStatus] : null
            return (
              <div key={order.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      Orden #{order.id}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
                      {label}
                    </span>
                    {pay && (
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${pay.color}`}>
                        {pay.label}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{formatDate(order.createdAt)}</span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="text-gray-800">
                        ${item.subtotal.toLocaleString('es-AR')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-gray-500">
                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ${order.total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
