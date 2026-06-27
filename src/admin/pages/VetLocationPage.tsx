import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MapPin, Loader2, Search } from 'lucide-react'
import { vetApi, type VetProfile } from '../api/vetApi'
import { VetLocationMap } from '../../shared/components/VetLocationMap'

interface GeocodingResult {
  display_name: string
  lat: string
  lon: string
}

export function VetLocationPage() {
  const [profile, setProfile] = useState<VetProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [results, setResults] = useState<GeocodingResult[]>([])

  useEffect(() => {
    vetApi.getMyProfile()
      .then((p) => {
        setProfile(p)
        setAddress(p.address ?? '')
        setCity(p.city ?? '')
        setLatitude(p.latitude ?? null)
        setLongitude(p.longitude ?? null)
      })
      .catch(() => toast.error('Error al cargar perfil'))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Escribí una dirección para buscar')
      return
    }
    setSearching(true)
    setResults([])
    try {
      const q = encodeURIComponent(searchQuery + ', Argentina')
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&countrycodes=ar`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data: GeocodingResult[] = await res.json()
      if (data.length === 0) {
        toast.info('No se encontraron resultados')
      }
      setResults(data)
    } catch {
      toast.error('Error al buscar dirección')
    } finally {
      setSearching(false)
    }
  }

  const selectResult = (r: GeocodingResult) => {
    setLatitude(Number(r.lat))
    setLongitude(Number(r.lon))
    setSearchQuery(r.display_name)
    setResults([])
    // Extract city from result if possible
    const parts = r.display_name.split(',')
    if (parts.length > 1) {
      setCity(parts[1].trim())
    }
  }

  const handleSave = async () => {
    if (latitude == null || longitude == null) {
      toast.error('Buscá una dirección primero')
      return
    }
    setSaving(true)
    try {
      const updated = await vetApi.updateLocation({
        address: searchQuery || address,
        city,
        latitude,
        longitude,
      })
      setProfile((prev) => prev ? { ...prev, ...updated } : null)
      toast.success('Ubicación actualizada')
    } catch {
      toast.error('Error al guardar ubicación')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const hasCoords = latitude != null && longitude != null

  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
        <MapPin className="h-6 w-6 text-blue-600" />
        Mi Ubicación
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Buscar dirección
              </label>
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {searching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>

              {results.length > 0 && (
                <div className="mt-2 overflow-hidden rounded-lg border">
                  {results.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => selectResult(r)}
                      className="w-full border-b px-3 py-2 text-left text-xs text-gray-700 last:border-0 hover:bg-blue-50"
                    >
                      {r.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Ej: Buenos Aires"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !hasCoords}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar ubicación
            </button>
          </div>
        </div>

        <div>
          {hasCoords ? (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-medium text-gray-700">Vista previa</p>
              <VetLocationMap
                location={{
                  latitude,
                  longitude,
                  name: profile?.name ?? '',
                  address: searchQuery || address,
                  city,
                }}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-400">Buscá una dirección para ver el mapa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
