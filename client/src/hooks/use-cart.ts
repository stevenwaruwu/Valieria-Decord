import { useState, useEffect } from "react";
import type { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Simple local storage cart management
export function useCart() {
  const [items, setItems] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("valieria_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  const saveCart = (newItems: any[]) => {
    setItems(newItems as any);
    localStorage.setItem("valieria_cart", JSON.stringify(newItems));
  };

  const addItem = (product: Product, quantity: number, variantId?: number) => {
    const cartItemId = variantId ? `${product.id}-${variantId}` : `${product.id}`;
    const existing = items.find((i: any) => (i.variantId ? `${i.product.id}-${i.variantId}` : `${i.product.id}`) === cartItemId);
    let newItems: any[];
    
    if (existing) {
      newItems = items.map((i: any) =>
        (i.variantId ? `${i.product.id}-${i.variantId}` : `${i.product.id}`) === cartItemId
          ? { ...i, quantity: i.quantity + (quantity || 1) }
          : i
      );
    } else {
      newItems = [...items, { product, quantity: quantity || 1, variantId }];
    }
    
    saveCart(newItems);
    toast({
      title: "Berhasil ditambahkan",
      description: `${product.name} telah ditambahkan ke keranjang.`,
    });
  };

  const removeItem = (productId: number) => {
    const newItems = items.filter((i) => i.product.id !== productId);
    saveCart(newItems);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("valieria_cart");
  };

  const total = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  return { items, addItem, removeItem, updateQuantity, clearCart, total };
}
