import { useEffect, useState } from 'react'
import { apiClient } from '../api/apiClient'

interface VetProfile {
  id: number
  name: string
  specialty: string | null
  matricula: string
  slug: string
  address?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
}

export function useTenant() {
  const [tenant, setTenant] = useState<VetProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const slug = extractSubdomain()
    if (!slug) {
      setLoading(false)
      return
    }

    apiClient
      .get<VetProfile>(`/vet/${slug}`)
      .then(setTenant)
      .catch(() => setTenant(null))
      .finally(() => setLoading(false))
  }, [])

  return { tenant, loading }
}

function extractSubdomain(): string | null {
  const host = window.location.hostname

  // localhost: subdomain.localhost -> extract subdomain
  if (host.endsWith('.localhost')) {
    const sub = host.slice(0, -'.localhost'.length)
    if (sub && !sub.includes('.')) return sub
    return null
  }

  // Production: subdomain.miapp.com
  const match = host.match(/^([^.]+)\.(miapp\.com|miapp\.com\.ar)$/)
  if (match && match[1] !== 'www') {
    return match[1]
  }

  return null
}
