import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { orderApi } from '../api/orderApi'
import { paymentApi } from '../api/paymentApi'
import { useState } from 'react'
import { ApiError } from '../../shared/api/apiClient'

export function CartPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCartStore()
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    try {
      setCheckingOut(true)
      setError(null)
      const order = await orderApi.createMyOrder(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      )
      const pref = await paymentApi.createPreference(order.id)
      clearCart()
      window.location.href = pref.checkoutUrl
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al procesar la orden')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Seguir comprando
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Carrito</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl bg-white py-20 text-center">
          <ShoppingCart className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">El carrito está vacío.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Explorar productos
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-white shadow-sm">
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4">
                <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                  <h3 className="truncate font-semibold text-gray-800">{item.productName}</h3>
                  <p className="text-sm text-blue-600">
                    ${item.price.toLocaleString('es-AR')} c/u
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded border text-sm hover:bg-gray-50 sm:h-7 sm:w-7 sm:min-h-0 sm:min-w-0"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded border text-sm hover:bg-gray-50 sm:h-7 sm:w-7 sm:min-h-0 sm:min-w-0"
                  >
                    +
                  </button>
                </div>
                <span className="ml-auto whitespace-nowrap font-semibold text-gray-800 sm:w-24 sm:text-right">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t px-4 py-4">
            <span className="text-sm text-gray-500">
              {items.reduce((s, i) => s + i.quantity, 0)} producto(s)
            </span>
            <span className="text-xl font-bold text-blue-600">
              ${totalPrice().toLocaleString('es-AR')}
            </span>
          </div>

          <div className="border-t px-4 py-4">
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {checkingOut ? 'Procesando...' : 'Finalizar compra'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
