import { useState } from "react";
import { useLocation } from "wouter";
import { Filter, SlidersHorizontal, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { useProducts } from "@/hooks/use-products";

export default function Catalog() {
  const [location] = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Parse URL params for initial state
  const params = new URLSearchParams(window.location.search);
  const [filters, setFilters] = useState({
    type: params.get("type") || undefined,
    room: params.get("room") || undefined,
    color: params.get("color") || undefined,
    search: params.get("search") || undefined,
  });

  const queryParams = new URLSearchParams(window.location.search);
  const sort = queryParams.get("sort");
  
  const { data: products, isLoading } = useProducts({ 
    type: filters.type as any,
    room: filters.room as any,
    color: filters.color as any,
    search: filters.search as any,
    bestSeller: sort === "best_seller" ? "true" : undefined,
    newArrival: sort === "new_arrival" ? "true" : undefined
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Koleksi</h1>
            <p className="text-muted-foreground">
              {products ? `${products.length} produk ditemukan` : 'Memuat produk...'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Cari produk..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-shadow"
                value={filters.search || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value || undefined }))}
              />
            </div>
            
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center px-4 py-2.5 bg-white border border-input rounded-xl hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Selected Filters Chips */}
        {(filters.type || filters.room || filters.color) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || key === 'search') return null;
              return (
                <div key={key} className="flex items-center px-3 py-1 bg-secondary rounded-full text-sm">
                  <span className="capitalize text-muted-foreground mr-1">{key}:</span>
                  <span className="font-medium capitalize">{String(value).replace('_', ' ')}</span>
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, [key]: undefined }))}
                    className="ml-2 hover:text-red-500"
                  >
                    <Filter className="w-3 h-3 rotate-45" />
                  </button>
                </div>
              );
            })}
            <button 
              onClick={() => setFilters({
                type: undefined,
                room: undefined,
                color: undefined,
                search: undefined
              })}
              className="text-sm text-muted-foreground hover:text-primary underline ml-2"
            >
              Hapus Semua
            </button>
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-[3/4] mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-medium mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products?.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </main>

      <FilterSidebar 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters}
        setFilters={setFilters}
      />
      
      <Footer />
    </div>
  );
}
