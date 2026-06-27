import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../api/apiClient'
import { ProductCard } from '../../products/components/ProductCard'
import { Dog, ShoppingBag, MapPin } from 'lucide-react'
import { VetLocationMap } from '../components/VetLocationMap'
import type { Product } from '../../products/types/product'

interface VetProfile {
  id: number
  name: string
  specialty: string | null
  matricula: string
  slug: string
  address?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
}

interface Props {
  tenant: VetProfile
}

export function VetStorefrontPage({ tenant }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState('')

  useEffect(() => {
    const params = category ? `?category=${category}` : ''
    apiClient.get<Product[]>(`/vet/${tenant.slug}/products${params}`)
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [tenant.slug, category])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Dog className="h-8 w-8" />
            <div>
              <h1 className="text-lg font-bold">{tenant.name}</h1>
              {tenant.specialty && (
                <p className="text-sm text-blue-200">{tenant.specialty}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-blue-200">Mat. {tenant.matricula}</span>
            <Link
              to="/register"
              className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-blue-400 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Productos</h2>
          <div className="flex flex-wrap gap-2">
            {[['', 'Todos'], ['FOOD', 'Alimento'], ['ACCESSORIES', 'Accesorios'], ['MEDICINE', 'Medicina'], ['HYGIENE', 'Higiene'], ['TOYS', 'Juguetes']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setCategory(val)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  category === val
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl bg-white py-16 text-center">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No hay productos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {tenant.latitude && tenant.longitude && (
          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
              <MapPin className="h-5 w-5 text-blue-600" />
              Ubicación
            </h2>
            <VetLocationMap
              location={{
                latitude: tenant.latitude,
                longitude: tenant.longitude,
                name: tenant.name,
                address: tenant.address,
                city: tenant.city,
              }}
            />
            {(tenant.address || tenant.city) && (
              <p className="mt-2 text-sm text-gray-500">
                {[tenant.address, tenant.city].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-400">
          <Dog className="mx-auto mb-1 h-4 w-4" />
          <p>Pet Care System &copy; {new Date().getFullYear()}</p>
        </div>
      </main>
    </div>
  )
}
