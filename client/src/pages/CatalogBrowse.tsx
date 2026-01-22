import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Wallpaper, LayoutPanelTop, Grid3X3 } from "lucide-react";

const categories = [
  {
    id: "wallpaper",
    title: "Wallpaper",
    description: "Koleksi wallpaper premium dengan berbagai motif dan tekstur.",
    icon: Wallpaper,
    color: "bg-blue-50",
    href: "/catalog/wallpaper"
  },
  {
    id: "wall_panel",
    title: "Wall Panel",
    description: "Panel dinding dekoratif untuk estetika arsitektural yang modern.",
    icon: LayoutPanelTop,
    color: "bg-orange-50",
    href: "/catalog/wall_panel"
  },
  {
    id: "rug",
    title: "Karpet",
    description: "Karpet berkualitas tinggi untuk kenyamanan dan kemewahan lantai Anda.",
    icon: Grid3X3,
    color: "bg-green-50",
    href: "/catalog/rug"
  }
];

export default function CatalogBrowse() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Jelajahi Katalog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Temukan produk interior terbaik untuk setiap sudut ruangan Anda berdasarkan kategori.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
            >
              <Link href={category.href}>
                <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col items-center text-center">
                  <div className={`p-4 rounded-xl ${category.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-6 text-primary font-medium text-sm flex items-center gap-2">
                    Lihat Koleksi
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
