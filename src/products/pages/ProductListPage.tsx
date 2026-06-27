import { useProducts, useProductFilters } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { ProductFilters } from '../components/ProductFilters'

export function ProductListPage() {
  const { products, loading, error } = useProducts()
  const { filtered, search, setSearch, category, setCategory } = useProductFilters(products)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Productos</h1>
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />
      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">
          No se encontraron productos.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
