import { useRoute, Link } from "wouter";
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";
import { ProductVariant } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: product, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto flex items-center justify-center h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
            <div className="h-4 bg-gray-200 w-32 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
          <Link href="/products" className="text-primary hover:underline mt-4 inline-block">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const price = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(selectedVariant?.price || product.price));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link href="/catalog-browse" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <img 
                src={selectedVariant?.imageUrl || product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-32 h-fit"
          >
            <div className="mb-2">
              <span className="text-sm font-medium text-primary/60 uppercase tracking-wider">
                {product.type.replace('_', ' ')}
              </span>
            </div>
            
            <h1 className="font-display text-4xl font-bold mb-4 leading-tight">{product.name}</h1>
            <p className="text-2xl font-medium mb-8">{price}</p>

            <div className="prose prose-sm text-muted-foreground mb-8">
              <p>{product.description}</p>
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-3">Varian</h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`aspect-square rounded-xl border-2 transition-all overflow-hidden ${
                        selectedVariant?.id === variant.id 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <img 
                        src={variant.imageUrl || ""} 
                        alt={variant.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <p className="mt-3 text-sm font-medium">
                    Terpilih: <span className="text-muted-foreground">{selectedVariant.name}</span>
                  </p>
                )}
              </div>
            )}

            <div className="h-px bg-gray-100 my-8" />

            {/* Actions */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-xl">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 rounded-l-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 rounded-r-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Stok tersedia: {selectedVariant?.stock || product.stock}
                </div>
              </div>

              <button
                onClick={() => addItem(product, quantity, selectedVariant?.id)}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Tambah ke Keranjang</span>
              </button>

              <div className="flex items-center justify-center text-xs text-muted-foreground space-x-6 pt-4">
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Pengiriman seluruh Indonesia
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
