import { mysqlTable, serial, varchar, text, int, decimal, json, timestamp, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";
import { users } from "./models/auth";

// === PRODUCTS ===
export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), 
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: int("stock").notNull().default(0),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  colorHex: varchar("color_hex", { length: 7 }).notNull(),
  roomCategory: varchar("room_category", { length: 50 }).notNull(),
  isNewArrival: boolean("is_new_arrival").default(false),
});

// === PRODUCT VARIANTS ===
export const productVariants = mysqlTable("product_variants", {
  id: int("id").primaryKey().autoincrement(),
  productId: int("product_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: int("stock").notNull().default(0),
  imageUrl: varchar("image_url", { length: 500 }),
  colorHex: varchar("color_hex", { length: 7 }),
});

// === ORDERS ===
export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingDetails: json("shipping_details").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === ORDER ITEMS ===
export const orderItems = mysqlTable("order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull(),
  productId: int("product_id").notNull(),
  variantId: int("variant_id"),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

// === RELATIONS ===
export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

// === SCHEMAS ===
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

// === TYPES ===
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type ProductWithVariants = Product & { variants: (typeof productVariants.$inferSelect)[] };
export type ProductVariant = typeof productVariants.$inferSelect;

export const shippingSchema = z.object({
  firstName: z.string().min(1, "Nama depan wajib diisi"),
  lastName: z.string().min(1, "Nama belakang wajib diisi"),
  address: z.string().min(5, "Alamat lengkap wajib diisi"),
  province: z.string().min(1, "Provinsi wajib dipilih"),
  city: z.string().min(1, "Kota wajib dipilih"),
  postalCode: z.string().min(1, "Kode pos wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  courier: z.string().min(1, "Kurir wajib dipilih"),
  service: z.string().min(1, "Layanan pengiriman wajib dipilih"),
  shippingCost: z.number().min(0),
});
