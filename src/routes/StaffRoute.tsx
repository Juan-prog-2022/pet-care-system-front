import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../auth/store/authStore'

export function StaffRoute() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'VETERINARIAN')) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
