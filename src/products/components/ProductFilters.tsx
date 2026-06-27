import { Search } from 'lucide-react'
import type { ProductCategory } from '../types/productCategory'

const categories: { value: ProductCategory | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'FOOD', label: 'Alimento' },
  { value: 'ACCESSORIES', label: 'Accesorios' },
  { value: 'MEDICINE', label: 'Medicinas' },
  { value: 'HYGIENE', label: 'Higiene' },
  { value: 'TOYS', label: 'Juguetes' },
  { value: 'OTHER', label: 'Otros' },
]

interface Props {
  search: string
  onSearchChange: (v: string) => void
  category: ProductCategory | ''
  onCategoryChange: (v: ProductCategory | '') => void
}

export function ProductFilters({ search, onSearchChange, category, onCategoryChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as ProductCategory | '')}
        className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  )
}
