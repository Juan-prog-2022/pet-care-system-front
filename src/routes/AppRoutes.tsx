import { Routes, Route } from 'react-router-dom'
import { LoginPage } from '../auth/pages/LoginPage'
import { RegisterPage } from '../auth/pages/RegisterPage'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import { StaffRoute } from './StaffRoute'
import { Layout } from '../shared/components/Layout'
import { HomePage } from '../shared/pages/HomePage'
import { ProductListPage } from '../products/pages/ProductListPage'
import { MyPetsPage } from '../pets/pages/MyPetsPage'
import { CreatePetPage } from '../pets/pages/CreatePetPage'
import { AdminVetsPage } from '../admin/pages/AdminVetsPage'
import { AdminDashboardPage } from '../admin/pages/AdminDashboardPage'
import { AdminReportsPage } from '../admin/pages/AdminReportsPage'
import { MyAppointmentsPage } from '../appointments/pages/MyAppointmentsPage'
import { CreateAppointmentPage } from '../appointments/pages/CreateAppointmentPage'
import { VetAppointmentsPage } from '../appointments/pages/VetAppointmentsPage'
import { VetSchedulePage } from '../appointments/pages/VetSchedulePage'
import { CartPage } from '../orders/pages/CartPage'
import { MyOrdersPage } from '../orders/pages/MyOrdersPage'
import { VetLocationPage } from '../admin/pages/VetLocationPage'
import { VetReportsPage } from '../admin/pages/VetReportsPage'
import NotFound from '../shared/pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pets" element={<MyPetsPage />} />
          <Route path="/pets/new" element={<CreatePetPage />} />
          <Route path="/pets/edit/:id" element={<CreatePetPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/appointments" element={<MyAppointmentsPage />} />
          <Route path="/appointments/new" element={<CreateAppointmentPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/vet/location" element={<VetLocationPage />} />
          <Route path="/vet/reports" element={<VetReportsPage />} />
        </Route>
      </Route>
      <Route element={<StaffRoute />}>
        <Route element={<Layout />}>
          <Route path="/appointments/manage" element={<VetAppointmentsPage />} />
          <Route path="/appointments/schedule" element={<VetSchedulePage />} />
        </Route>
      </Route>
      <Route element={<AdminRoute />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminVetsPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
