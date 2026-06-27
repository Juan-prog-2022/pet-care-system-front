import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { searchImages, type ImageResult } from '../api/unsplashApi'

interface Props {
  query: string
  onSelect: (image: ImageResult) => void
  selectedUrl?: string | null
}

export function ImagePicker({ query, onSelect, selectedUrl }: Props) {
  const [searchTerm, setSearchTerm] = useState(query)
  const [results, setResults] = useState<ImageResult[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    const term = searchTerm.trim()
    if (!term) return
    setSearching(true)
    setError(null)
    try {
      const images = await searchImages(term)
      setResults(images)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al buscar imágenes'
      setError(msg)
      console.error('Unsplash search error:', err)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Foto</label>

      {selectedUrl ? (
        <div className="relative mb-2">
          <img
            src={selectedUrl}
            alt="Seleccionada"
            className="h-32 w-full rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => onSelect({ id: '', url: '', thumb: '', alt: '', author: '', link: '' })}
            className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white"
          >
            Quitar
          </button>
        </div>
      ) : (
        <div className="mb-2">
          <img
            src={`https://placehold.co/600x400/e2e8f0/94a3b8?text=Foto`}
            alt="Sin foto"
            className="h-32 w-full rounded-lg object-cover"
          />
        </div>
      )}

      <div className="mb-2 flex items-center gap-2">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch() } }}
          placeholder="Buscá imágenes de Unsplash"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </div>

      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {results.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onSelect(img)}
              className={`overflow-hidden rounded-lg border-2 transition hover:opacity-80 ${
                selectedUrl === img.url ? 'border-blue-600' : 'border-transparent'
              }`}
            >
              <img
                src={img.thumb}
                alt={img.alt}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
