import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-xl font-bold mb-6">VALIERIA DECORD</h3>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Menghadirkan kemewahan dan estetika ke dalam setiap sudut ruangan Anda.
              Koleksi wallpaper, karpet, dan wall panel premium untuk hunian impian.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Koleksi</h4>
            <ul className="space-y-4">
              <li><Link href="/products?type=wallpaper" className="text-muted-foreground hover:text-primary transition-colors">Wallpaper</Link></li>
              <li><Link href="/products?type=rug" className="text-muted-foreground hover:text-primary transition-colors">Karpet</Link></li>
              <li><Link href="/products?type=wall_panel" className="text-muted-foreground hover:text-primary transition-colors">Wall Panel</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Bantuan</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pengiriman</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Hubungi Kami</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 Valieria Decord. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
