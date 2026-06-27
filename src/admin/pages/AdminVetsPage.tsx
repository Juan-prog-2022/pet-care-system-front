import { Check, X, RefreshCw, Stethoscope } from 'lucide-react'
import { toast } from 'react-toastify'
import { usePendingVeterinarians } from '../hooks/useAdminVets'

export function AdminVetsPage() {
  const { vets, loading, error, approve, reject, refetch } = usePendingVeterinarians()

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Veterinarios Pendientes</h1>
        <button
          onClick={refetch}
          className="flex items-center gap-1.5 rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && vets.length === 0 && (
        <div className="flex flex-col items-center rounded-xl bg-white py-20 text-center">
          <Stethoscope className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No hay veterinarios pendientes de aprobación.</p>
        </div>
      )}

      {!loading && vets.length > 0 && (
        <div className="space-y-3">
          {vets.map((vet) => (
            <div
              key={vet.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{vet.name}</h3>
                <p className="text-sm text-gray-500">{vet.email}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>Matrícula: {vet.matricula}</span>
                    {vet.slug && <span>Subdominio: {vet.slug}.localhost</span>}
                    {vet.specialty && <span>Especialidad: {vet.specialty}</span>}
                    <span>Solicitó: {formatDate(vet.createdAt)}</span>
                  </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    approve(vet.id)
                    toast.success(`${vet.name} aprobado correctamente`)
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  Aprobar
                </button>
                <button
                  onClick={() => {
                    reject(vet.id)
                    toast.info(`${vet.name} rechazado`)
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
