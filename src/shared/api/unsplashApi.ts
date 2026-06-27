const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
console.log('[unsplashApi] key exists:', !!ACCESS_KEY, 'length:', ACCESS_KEY?.length)

interface UnsplashPhoto {
  id: string
  urls: {
    small: string
    regular: string
  }
  alt_description: string | null
  user: {
    name: string
    links: {
      html: string
    }
  }
}

interface SearchResult {
  results: UnsplashPhoto[]
}

export interface ImageResult {
  id: string
  url: string
  thumb: string
  alt: string
  author: string
  link: string
}

export async function searchImages(query: string): Promise<ImageResult[]> {
  if (!ACCESS_KEY) {
    throw new Error('VITE_UNSPLASH_ACCESS_KEY no configurada')
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=squarish`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  )

  if (!res.ok) throw new Error(`Unsplash error: ${res.status}`)

  const data: SearchResult = await res.json()

  return data.results.map((p) => ({
    id: p.id,
    url: p.urls.regular,
    thumb: p.urls.small,
    alt: p.alt_description ?? '',
    author: p.user.name,
    link: p.user.links.html,
  }))
}
