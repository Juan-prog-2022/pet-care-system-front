import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'
import { Users, Dog, ShoppingBag, Calendar, ShoppingCart, DollarSign, Loader2 } from 'lucide-react'
import { metricsApi, type DashboardMetrics } from '../api/metricsApi'

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    metricsApi.getDashboard()
      .then(setData)
      .catch(() => setError('Error al cargar métricas'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !data) {
    return <div className="rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
  }

  const kpis = [
    { label: 'Usuarios', value: data.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Veterinarios', value: data.totalVeterinarians, icon: Dog, color: 'bg-green-500' },
    { label: 'Productos', value: data.totalProducts, icon: ShoppingBag, color: 'bg-purple-500' },
    { label: 'Turnos', value: data.totalAppointments, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Órdenes', value: data.totalOrders, icon: ShoppingCart, color: 'bg-pink-500' },
    { label: 'Ingresos', value: `$${data.totalRevenue.toLocaleString('es-AR')}`, icon: DollarSign, color: 'bg-teal-500' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl bg-white p-4 shadow-sm">
            <div className={`mb-2 inline-flex rounded-lg p-2 ${color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Turnos por mes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.appointmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Ventas por mes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
