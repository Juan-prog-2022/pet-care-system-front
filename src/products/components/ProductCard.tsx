import { ShoppingBag, PawPrint, Shirt, Pill, Dog, Sparkles, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import type { Product } from '../types/product'
import type { ProductCategory } from '../types/productCategory'
import { useCartStore } from '../../orders/store/cartStore'

const categoryConfig: Record<ProductCategory, { label: string; color: string; icon: typeof PawPrint }> = {
  FOOD: { label: 'Alimento', color: 'bg-green-100 text-green-700', icon: Dog },
  ACCESSORIES: { label: 'Accesorio', color: 'bg-purple-100 text-purple-700', icon: Shirt },
  MEDICINE: { label: 'Medicina', color: 'bg-red-100 text-red-700', icon: Pill },
  HYGIENE: { label: 'Higiene', color: 'bg-cyan-100 text-cyan-700', icon: Sparkles },
  TOYS: { label: 'Juguete', color: 'bg-orange-100 text-orange-700', icon: PawPrint },
  OTHER: { label: 'Otro', color: 'bg-gray-100 text-gray-700', icon: ShoppingBag },
}

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const { label, color, icon: Icon } = categoryConfig[product.category]

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm transition hover:shadow-md">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="h-40 w-full rounded-t-xl object-cover" />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-t-xl bg-blue-50">
          <Icon className="h-16 w-16 text-blue-300" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800">{product.name}</h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
            {label}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-gray-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-blue-600">
            ${product.price.toLocaleString('es-AR')}
          </span>
          <span className="text-xs text-gray-400">
            {product.stock > 0 ? `${product.stock} uds.` : 'Sin stock'}
          </span>
        </div>
        {product.stock > 0 && (
          <button
            onClick={() => {
              addItem(product.id, product.name, product.price)
              toast.success(`${product.name} agregado al carrito`)
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Agregar al carrito
          </button>
        )}
      </div>
    </div>
  )
}
