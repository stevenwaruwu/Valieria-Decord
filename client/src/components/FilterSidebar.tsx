import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    type?: string;
    room?: string;
    color?: string;
  };
  setFilters: (filters: any) => void;
}

const ROOMS = [
  { id: "living_room", label: "Ruang Tamu" },
  { id: "bedroom", label: "Kamar Tidur" },
  { id: "dining_room", label: "Ruang Makan" },
  { id: "office", label: "Kantor" },
];

const TYPES = [
  { id: "wallpaper", label: "Wallpaper" },
  { id: "rug", label: "Karpet" },
  { id: "wall_panel", label: "Wall Panel" },
];

const COLORS = [
  { id: "white", hex: "#FFFFFF", label: "Putih" },
  { id: "beige", hex: "#F5F5DC", label: "Beige" },
  { id: "gray", hex: "#808080", label: "Abu-abu" },
  { id: "charcoal", hex: "#36454F", label: "Charcoal" },
  { id: "navy", hex: "#000080", label: "Navy" },
  { id: "gold", hex: "#FFD700", label: "Emas" },
];

export function FilterSidebar({ isOpen, onClose, filters, setFilters }: FilterSidebarProps) {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-xl font-bold">Filter</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8 flex-1">
                {/* Type Filter */}
                <section>
                  <h3 className="font-medium mb-4">Kategori</h3>
                  <div className="space-y-3">
                    {TYPES.map((type) => (
                      <label key={type.id} className="flex items-center space-x-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          filters.type === type.id ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary"
                        }`}>
                          {filters.type === type.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={filters.type === type.id}
                          onChange={() => updateFilter("type", type.id)}
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </section>

                <div className="h-px bg-gray-100" />

                {/* Room Filter */}
                <section>
                  <h3 className="font-medium mb-4">Ruangan</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ROOMS.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => updateFilter("room", room.id)}
                        className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                          filters.room === room.id
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-muted-foreground border-gray-200 hover:border-primary"
                        }`}
                      >
                        {room.label}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="h-px bg-gray-100" />

                {/* Color Filter */}
                <section>
                  <h3 className="font-medium mb-4">Warna</h3>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => updateFilter("color", color.id)}
                        className={`w-8 h-8 rounded-full border shadow-sm relative transition-transform ${
                          filters.color === color.id ? "ring-2 ring-primary ring-offset-2 scale-110" : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setFilters({});
                    onClose();
                  }}
                  className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-3"
                >
                  Hapus Filter
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-primary text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
