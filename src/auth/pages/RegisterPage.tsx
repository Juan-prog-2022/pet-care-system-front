import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuthStore } from '../store/authStore'
import type { RegisterRequest } from '../types/auth'

interface RegisterForm {
  name: string
  email: string
  password: string
  role: 'CUSTOMER' | 'VETERINARIAN'
  matricula?: string
  slug?: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((s) => s.register)
  const error = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ defaultValues: { role: 'CUSTOMER' } })

  const selectedRole = watch('role')

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const response = await registerUser(data as RegisterRequest)
      if (data.role === 'VETERINARIAN' && (!response || !response.token)) {
        toast.success('Registro exitoso. Tu cuenta está pendiente de aprobación.')
        navigate('/login')
      } else {
        toast.success('Cuenta creada correctamente')
        navigate('/')
      }
    } catch {
      // error set in store
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg sm:mx-0 sm:p-8"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Crear Cuenta
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            {...register('name', { required: 'El nombre es obligatorio' })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
            })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tipo de cuenta
          </label>
          <select
            {...register('role')}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CUSTOMER">Dueño de mascota</option>
            <option value="VETERINARIAN">Veterinario</option>
          </select>
        </div>

        {selectedRole === 'VETERINARIAN' && (
          <>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Matrícula profesional
              </label>
              <input
                type="text"
                {...register('matricula', {
                  required:
                    selectedRole === 'VETERINARIAN'
                      ? 'La matrícula es obligatoria'
                      : false,
                })}
                placeholder="Ej: MP-12345"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.matricula && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.matricula.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Subdominio
              </label>
              <div className="flex flex-wrap items-center gap-1 sm:flex-nowrap">
                <input
                  type="text"
                  {...register('slug', {
                    required: selectedRole === 'VETERINARIAN' ? 'El subdominio es obligatorio' : false,
                    pattern: { value: /^[a-z0-9-]+$/, message: 'Solo minúsculas, números y guiones' },
                  })}
                  placeholder="Ej: mi-veterinaria"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:flex-1"
                />
                <span className="text-xs text-gray-400">.localhost</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Los clientes accederán a tu tienda mediante este subdominio.
              </p>
              {errors.slug && (
                <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tenés cuenta?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
            onClick={clearError}
          >
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  )
}
