import { db } from "./db";
import { 
  products, orders, orderItems, productVariants,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type ProductWithVariants
} from "@shared/schema";
import { eq, like, and, desc } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(filters?: { 
    type?: string; 
    room?: string; 
    color?: string; 
    search?: string;
    bestSeller?: boolean;
    newArrival?: boolean;
  }): Promise<Product[]>;
  getProduct(id: number): Promise<ProductWithVariants | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrder(id: number): Promise<Order | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(filters?: { 
    type?: string; 
    room?: string; 
    color?: string; 
    search?: string;
    bestSeller?: boolean;
    newArrival?: boolean;
  }): Promise<Product[]> {
    let query = db.select().from(products);
    const conditions = [];

    if (filters) {
      if (filters.type) conditions.push(eq(products.type, filters.type));
      if (filters.room) conditions.push(eq(products.roomCategory, filters.room));
      if (filters.color) conditions.push(eq(products.colorHex, filters.color));
      if (filters.search) conditions.push(like(products.name, `%${filters.search}%`));
      if (filters.bestSeller) conditions.push(eq(products.isNewArrival, false));
      if (filters.newArrival) conditions.push(eq(products.isNewArrival, true));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<ProductWithVariants | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) return undefined;
    
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, id));
    return { ...product, variants };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [result] = await db.insert(products).values(product);
    // In MySQL, result.insertId is the ID
    const id = result.insertId;
    return { ...product, id } as Product;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [result] = await db.insert(orders).values(order);
    const id = result.insertId;
    return { ...order, id, createdAt: new Date() } as Order;
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [result] = await db.insert(orderItems).values(item);
    const id = result.insertId;
    return { ...item, id } as OrderItem;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
}

export const storage = new DatabaseStorage();
