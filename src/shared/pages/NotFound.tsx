import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-8xl font-bold text-gray-200">404</h1>
      <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
      <p className="text-gray-400 mt-2">La ruta que buscas no existe o fue movida.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Volver al inicio
      </button>
    </div>
  )
}
