import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.filter(p => p.isNewArrival).slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Luxury Interior */}
        {/* Unsplash: Modern luxury living room with high ceiling */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Kemewahan dalam<br />Setiap Detail
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl font-light text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Temukan koleksi wallpaper, karpet, dan wall panel eksklusif untuk menyempurnakan hunian Anda.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link 
              href="/products" 
              className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
            >
              Jelajahi Koleksi
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold mb-4">Kategori Pilihan</h2>
          <p className="text-muted-foreground">Eksplorasi elemen dekoratif terbaik untuk ruangan Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: "Wallpaper", 
              image: "https://images.unsplash.com/photo-1595407675988-724d2091206f?w=800&auto=format&fit=crop", 
              link: "/products?type=wallpaper" 
            },
            { 
              name: "Karpet", 
              image: "https://images.unsplash.com/photo-1596236629961-c887f48b8c2c?w=800&auto=format&fit=crop", 
              link: "/products?type=rug" 
            },
            { 
              name: "Wall Panel", 
              image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=800&auto=format&fit=crop", 
              link: "/products?type=wall_panel" 
            },
          ].map((cat, idx) => (
            <Link key={cat.name} href={cat.link}>
              <motion.div 
                whileHover={{ y: -8 }}
                className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <h3 className="font-display text-2xl font-bold mb-2">{cat.name}</h3>
                    <div className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                      Lihat Produk <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-secondary/30 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">Koleksi Terbaru</h2>
              <p className="text-muted-foreground">Produk terbaru yang baru saja tiba</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center font-medium text-primary hover:text-primary/70 transition-colors">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-[3/4] mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {featuredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/products" className="inline-flex items-center font-medium text-primary">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
