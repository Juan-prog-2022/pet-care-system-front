import { useState } from 'react'
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { reportsApi, type ReportRow } from '../api/reportsApi'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const columnLabels: Record<string, string> = {
  id: 'ID',
  customerName: 'Cliente',
  petName: 'Mascota',
  dateTime: 'Fecha',
  status: 'Estado',
  reason: 'Motivo',
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
}

export function VetReportsPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [data, setData] = useState<ReportRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await reportsApi.getMyAppointments(startDate || undefined, endDate || undefined)
      setData(result)
    } catch {
      setError('Error al cargar el informe')
    } finally {
      setLoading(false)
    }
  }

  const exportExcel = () => {
    if (!data) return
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
    XLSX.writeFile(wb, `turnos-reporte.xlsx`)
  }

  const exportPdf = () => {
    if (!data) return
    const doc = new jsPDF()
    const columns = data.length > 0 ? Object.keys(data[0]) : []
    const headers = columns.map((c) => columnLabels[c] || formatLabel(c))
    const rows = data.map((row) => columns.map((c) => String(row[c] ?? '')))
    autoTable(doc, { head: [headers], body: rows })
    doc.save(`turnos-reporte.pdf`)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Mis Informes</h1>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Desde</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Hasta</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Generar
            </button>
          </div>
        </div>

        {data && data.length > 0 && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={exportExcel}
              className="flex items-center gap-1.5 rounded-lg border border-green-500 px-3 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>
            <button
              onClick={exportPdf}
              className="flex items-center gap-1.5 rounded-lg border border-red-500 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      )}

      {data && data.length === 0 && !loading && (
        <p className="py-10 text-center text-sm text-gray-400">
          No hay turnos para los filtros seleccionados.
        </p>
      )}

      {data && data.length > 0 && !loading && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="whitespace-nowrap px-4 py-3 font-medium text-gray-600">
                    {columnLabels[key] || formatLabel(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="whitespace-nowrap px-4 py-3 text-gray-700">
                      {String(val ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
