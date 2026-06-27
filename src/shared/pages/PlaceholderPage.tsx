import { useLocation } from 'react-router-dom'

export function PlaceholderPage() {
  const location = useLocation()
  const title = location.pathname === '/admin' ? 'Panel de Administración' : 'Próximamente'

  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 text-center">
      <div className="mb-4 text-6xl">🚧</div>
      <h1 className="mb-2 text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500">Esta sección está en construcción</p>
    </div>
  )
}
