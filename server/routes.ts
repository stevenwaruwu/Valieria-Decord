import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // === PRODUCTS ===
  app.get(api.products.list.path, async (req, res) => {
    const filters: any = {
      type: req.query.type as string,
      room: req.query.room as string,
      color: req.query.color as string,
      search: req.query.search as string,
      bestSeller: req.query.bestSeller === "true",
      newArrival: req.query.newArrival === "true",
    };
    const products = await storage.getProducts(filters);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // === ORDERS ===
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Harap login untuk melakukan pemesanan" });
    }
    
    try {
      const input = api.orders.create.input.parse(req.body);
      const user = req.user as any;

      // Calculate total
      let total = 0;
      for (const item of input.items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          total += Number(product.price) * item.quantity;
        }
      }
      total += input.shippingDetails.shippingCost;

      // Create Order
      const order = await storage.createOrder({
        userId: user.claims.sub, // Replit Auth ID
        status: "pending",
        total: total.toString(), // Store as string/decimal
        shippingDetails: input.shippingDetails,
      });

      // Create Order Items
      for (const item of input.items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            variantId: null, // Default for now
            quantity: item.quantity,
            price: product.price,
          });
        }
      }

      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // === MOCK SHIPPING API (RajaOngkir Style) ===
  const MOCK_PROVINCES = [
    { province_id: "1", province: "Bali" },
    { province_id: "2", province: "Bangka Belitung" },
    { province_id: "3", province: "Banten" },
    { province_id: "4", province: "Bengkulu" },
    { province_id: "5", province: "DI Yogyakarta" },
    { province_id: "6", province: "DKI Jakarta" },
    { province_id: "7", province: "Gorontalo" },
    { province_id: "8", province: "Jambi" },
    { province_id: "9", province: "Jawa Barat" },
    { province_id: "10", province: "Jawa Tengah" },
    { province_id: "11", province: "Jawa Timur" },
  ];

  const MOCK_CITIES: Record<string, any[]> = {
    "6": [ // DKI Jakarta
      { city_id: "151", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Barat", postal_code: "11000" },
      { city_id: "152", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Pusat", postal_code: "10000" },
      { city_id: "153", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Selatan", postal_code: "12000" },
      { city_id: "154", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Timur", postal_code: "13000" },
      { city_id: "155", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Utara", postal_code: "14000" },
    ],
    "9": [ // Jawa Barat
      { city_id: "22", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Bandung", postal_code: "40000" },
      { city_id: "23", province_id: "9", province: "Jawa Barat", type: "Kabupaten", city_name: "Bandung Barat", postal_code: "40500" },
      { city_id: "54", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Bekasi", postal_code: "17000" },
      { city_id: "78", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Bogor", postal_code: "16000" },
      { city_id: "115", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Depok", postal_code: "16400" },
    ],
  };

  app.get(api.shipping.provinces.path, (req, res) => {
    res.json(MOCK_PROVINCES);
  });

  app.get(api.shipping.cities.path, (req, res) => {
    const provinceId = req.params.provinceId as string;
    const cities = MOCK_CITIES[provinceId] || [];
    res.json(cities);
  });

  app.post(api.shipping.cost.path, (req: any, res) => {
    // Mock calculation logic
    const { destination, weight, courier } = req.body;
    
    // Simulate cost based on courier and dummy distance logic
    const baseCost = 10000;
    const weightCost = (weight / 1000) * 5000;
    
    let services: any[] = [];

    if (courier === "jne") {
      services = [
        { service: "REG", description: "Layanan Reguler", cost: [{ value: baseCost + weightCost, etd: "2-3", note: "" }] },
        { service: "YES", description: "Yakin Esok Sampai", cost: [{ value: (baseCost + weightCost) * 1.5, etd: "1-1", note: "" }] },
      ];
    } else if (courier === "tiki") {
      services = [
        { service: "ECO", description: "Economy Service", cost: [{ value: baseCost + weightCost * 0.8, etd: "3-5", note: "" }] },
        { service: "ONS", description: "Over Night Service", cost: [{ value: (baseCost + weightCost) * 1.6, etd: "1-1", note: "" }] },
      ];
    } else if (courier === "pos") {
      services = [
        { service: "KILAT", description: "Pos Kilat Khusus", cost: [{ value: baseCost + weightCost * 0.9, etd: "2-4", note: "" }] },
      ];
    }

    res.json([
      {
        code: courier,
        name: courier.toUpperCase(),
        costs: services,
      }
    ]);
  });

  // await seedDatabase(); // Temporarily disabled to favor CSV seeding

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    console.log("Seeding database...");
    const productsData: any[] = [
      {
        name: "Wallpaper Silk Charcoal - Minimalis Modern",
        type: "wallpaper",
        description: "Hadirkan suasana mewah yang menenangkan dengan Wallpaper Silk Charcoal kami. Tekstur sutra yang halus dipadukan dengan warna arang yang mendalam menciptakan kedalaman visual yang tak tertandingi di ruang tamu atau kamar tidur Anda. Sangat tahan lama, mudah dipasang, dan memberikan sentuhan modern yang tak lekang oleh waktu.",
        price: "450000",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop",
        colorHex: "#36454F",
        roomCategory: "living_room",
        isNewArrival: true,
      },
      {
        name: "Karpet Persia Royal Blue - Elegansi Klasik",
        type: "rug",
        description: "Sentuhan kemegahan kerajaan untuk lantai Anda. Karpet Persia Royal Blue ini ditenun dengan presisi menggunakan serat premium yang sangat lembut namun tangguh. Motifnya yang kaya bercerita tentang warisan desain klasik, sempurna untuk menjadi pusat perhatian di ruang utama Anda.",
        price: "2500000",
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1596162954151-cdfae8e641e3?q=80&w=800&auto=format&fit=crop",
        colorHex: "#002366",
        roomCategory: "living_room",
        isNewArrival: false,
      },
      {
        name: "Wall Panel Kayu Oak - Kehangatan Alami",
        type: "wall_panel",
        description: "Ubah dinding biasa menjadi karya seni arsitektur dengan Wall Panel Kayu Oak kami. Terbuat dari kayu pilihan dengan serat alami yang diekspos secara indah, panel ini tidak hanya menambah estetika ruangan tetapi juga memberikan insulasi termal dan akustik tambahan. Ideal untuk ruang kerja atau dinding aksen kamar tidur.",
        price: "850000",
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        colorHex: "#C9A66B",
        roomCategory: "bedroom",
        isNewArrival: true,
      },
      {
        name: "Wallpaper Gold Geometric - Kemewahan Berani",
        type: "wallpaper",
        description: "Tampilkan pernyataan gaya yang berani dengan Wallpaper Gold Geometric. Pola garis geometris berwarna emas metalik di atas latar belakang netral memberikan pantulan cahaya yang indah, menciptakan kesan ruangan yang lebih luas dan cerah. Sempurna bagi Anda yang mendambakan interior bergaya Glam atau Art Deco.",
        price: "550000",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7bab58d?q=80&w=800&auto=format&fit=crop",
        colorHex: "#FFD700",
        roomCategory: "living_room",
        isNewArrival: false,
      },
      {
        name: "Karpet Minimalis Abu-abu - Kenyamanan Urban",
        type: "rug",
        description: "Keseimbangan sempurna antara gaya dan fungsi. Karpet Minimalis Abu-abu ini dirancang untuk gaya hidup urban yang aktif. Materialnya yang anti-noda dan mudah dibersihkan menjadikannya pilihan praktis tanpa mengorbankan estetika minimalis yang bersih di rumah Anda.",
        price: "1200000",
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1575414723300-362f68266296?q=80&w=800&auto=format&fit=crop",
        colorHex: "#808080",
        roomCategory: "bedroom",
        isNewArrival: true,
      },
      {
        name: "Marble Wall Panel - Estetika Abadi",
        type: "wall_panel",
        description: "Dapatkan tampilan mewah marmer asli tanpa beban berat dan biaya perawatan yang rumit. Marble Wall Panel kami mereplikasi keindahan marmer Carrara dengan detail yang sangat realistis. Tahan lembab, sangat cocok untuk memberikan kesan spa mewah di kamar mandi atau kemewahan di ruang makan.",
        price: "1500000",
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?q=80&w=800&auto=format&fit=crop",
        colorHex: "#F0F0F0",
        roomCategory: "bathroom",
        isNewArrival: false,
      },
    ];

    for (const p of productsData) {
      await storage.createProduct(p);
    }
    console.log("Database seeded successfully.");
  }
}
