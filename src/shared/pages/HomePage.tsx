import { Link } from 'react-router-dom'
import { PawPrint, ShoppingBag, Calendar, Package } from 'lucide-react'

const cards = [
  { to: '/pets', title: 'Mis Mascotas', desc: 'Gestioná tus mascotas', icon: PawPrint },
  { to: '/products', title: 'Productos', desc: 'Comprá alimentos y accesorios', icon: ShoppingBag },
  { to: '/appointments', title: 'Turnos', desc: 'Reservá y administrá citas', icon: Calendar },
  { to: '/orders', title: 'Órdenes', desc: 'Seguí tus compras', icon: Package },
]

export function HomePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Panel Principal</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ to, title, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <Icon className="mb-2 h-8 w-8 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
