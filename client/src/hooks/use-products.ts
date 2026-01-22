import { useQuery } from "@tanstack/react-query";
import { api, buildUrl, type Product } from "@shared/routes";

export function useProducts(filters?: { 
  type?: string; 
  room?: string; 
  color?: string; 
  search?: string;
  bestSeller?: string;
  newArrival?: string;
}) {
  // Construct query key based on filters to ensure caching works correctly
  const queryKey = [api.products.list.path, filters];

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build the URL with query parameters
      // Note: The api definition for list includes input schema but it's passed as query params for GET
      const url = new URL(api.products.list.path, window.location.origin);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });
      }
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Gagal memuat produk");
      
      const data = await res.json();
      return api.products.list.responses[200].parse(data);
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Gagal memuat detail produk");
      
      const data = await res.json();
      return api.products.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}
