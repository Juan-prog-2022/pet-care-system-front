import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface Location {
  latitude: number
  longitude: number
  name: string
  address?: string | null
  city?: string | null
}

interface Props {
  location: Location
}

export function VetLocationMap({ location }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
        Cargando mapa...
      </div>
    )
  }

  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-48 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.latitude, location.longitude]} icon={defaultIcon}>
        <Popup>
          <strong>{location.name}</strong>
          {location.address && <br />}
          {location.address}
          {location.city && <>, {location.city}</>}
        </Popup>
      </Marker>
    </MapContainer>
  )
}
