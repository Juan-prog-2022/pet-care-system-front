import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PawPrint, ShoppingBag, Calendar, Package, Shield, LogOut, ShoppingCart, Menu, X, BarChart3, MapPin, FileText, ClipboardList } from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore'
import { useCartStore } from '../../orders/store/cartStore'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  const linkClass = 'flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600'

  const links = (
    <>
      {user?.role === 'CUSTOMER' && (
        <Link to="/pets" className={linkClass} onClick={() => setMenuOpen(false)}>
          <PawPrint className="h-4 w-4" />
          Mis Mascotas
        </Link>
      )}
      <Link to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>
        <ShoppingBag className="h-4 w-4" />
        Productos
      </Link>
      {user?.role === 'CUSTOMER' ? (
        <Link to="/appointments" className={linkClass} onClick={() => setMenuOpen(false)}>
          <Calendar className="h-4 w-4" />
          Turnos
        </Link>
      ) : (
        <Link to="/appointments/manage" className={linkClass} onClick={() => setMenuOpen(false)}>
          <Calendar className="h-4 w-4" />
          Gestionar Turnos
        </Link>
      )}
      {user?.role === 'VETERINARIAN' && (
        <>
          <Link to="/appointments/schedule" className={linkClass} onClick={() => setMenuOpen(false)}>
            <ClipboardList className="h-4 w-4" />
            Mi Horario
          </Link>
          <Link to="/vet/location" className={linkClass} onClick={() => setMenuOpen(false)}>
            <MapPin className="h-4 w-4" />
            Mi Ubicación
          </Link>
          <Link to="/vet/reports" className={linkClass} onClick={() => setMenuOpen(false)}>
            <FileText className="h-4 w-4" />
            Informes
          </Link>
        </>
      )}
      <Link to="/orders" className={linkClass} onClick={() => setMenuOpen(false)}>
        <Package className="h-4 w-4" />
        Órdenes
      </Link>
      <Link to="/cart" className={`${linkClass} relative`} onClick={() => setMenuOpen(false)}>
        <ShoppingCart className="h-4 w-4" />
        Carrito
        {cartCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </Link>
      {user?.role === 'ADMIN' && (
        <>
          <Link to="/admin/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>
            <Shield className="h-4 w-4" />
            Veterinarios
          </Link>
          <Link to="/admin/reports" className={linkClass} onClick={() => setMenuOpen(false)}>
            <FileText className="h-4 w-4" />
            Informes
          </Link>
        </>
      )}
    </>
  )

  return (
    <nav className="bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-blue-600">
          <PawPrint className="h-6 w-6" />
          Pet Care System
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-gray-600 sm:inline">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="hidden items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 sm:flex"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 sm:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="hidden items-center gap-5 sm:flex">
        {links}
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-600 sm:hidden">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 sm:hidden"
        >
          <LogOut className="h-3.5 w-3.5" />
          Cerrar sesión
        </button>
      </div>

      {menuOpen && (
        <div className="mt-3 flex flex-col gap-3 border-t border-gray-200 pt-3 sm:hidden">
          {links}
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}
