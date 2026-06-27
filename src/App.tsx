import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import { VetStorefrontPage } from './shared/pages/VetStorefrontPage'
import { useTenant } from './shared/hooks/useTenant'

function AppInner() {
  const { tenant, loading } = useTenant()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (tenant) {
    return (
      <>
        <VetStorefrontPage tenant={tenant} />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    )
  }

  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}

export default App
