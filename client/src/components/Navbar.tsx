import { Link, useLocation } from "wouter";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { items } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const collections = [
    { name: "Produk Terlaris", href: "/products?sort=best_seller" },
    { name: "Produk Terbaru", href: "/products?sort=new_arrival" },
    { name: "Browse Katalog", href: "/catalog-browse" },
  ];

  const navLinks = [
    { name: "Koleksi", href: "#", hasDropdown: true },
    { name: "Inspirasi", href: "/inspiration" },
    { name: "Tentang Kami", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            VALIERIA DECORD
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group/nav">
                {link.hasDropdown ? (
                  <div className="relative group">
                    <button
                      className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                        location.startsWith("/products") || location === "/catalog-browse" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {link.name}
                      <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                      <div className="py-2">
                        {collections.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-gray-50 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="relative group p-2 order-2">
              <ShoppingBag className="w-5 h-5 text-foreground transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group order-1">
                <button className="p-2 flex items-center space-x-2">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-foreground" />
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="py-1">
                    <p className="px-4 py-2 text-xs text-muted-foreground font-medium truncate">
                      Halo, {user?.username || 'User'}
                    </p>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/cart" className="hidden md:block text-sm font-medium hover:text-primary transition-colors order-1">
                Masuk
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 order-3"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">Koleksi</p>
                {collections.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-lg font-medium py-2 px-2 border-b border-gray-50 hover:text-primary transition-colors"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {navLinks.filter(l => !l.hasDropdown).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-lg font-medium py-2 px-2 border-b border-gray-100 hover:text-primary transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <Link
                  href="/api/login"
                  className="block text-lg font-medium py-2 px-2 text-primary"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Masuk
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
