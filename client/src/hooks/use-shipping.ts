import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useProvinces() {
  return useQuery({
    queryKey: [api.shipping.provinces.path],
    queryFn: async () => {
      const res = await fetch(api.shipping.provinces.path);
      if (!res.ok) throw new Error("Gagal memuat provinsi");
      return api.shipping.provinces.responses[200].parse(await res.json());
    },
  });
}

export function useCities(provinceId?: string) {
  return useQuery({
    queryKey: [api.shipping.cities.path, provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      const url = buildUrl(api.shipping.cities.path, { provinceId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal memuat kota");
      return api.shipping.cities.responses[200].parse(await res.json());
    },
    enabled: !!provinceId,
  });
}

export function useShippingCost(params: {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}) {
  return useQuery({
    queryKey: [api.shipping.cost.path, params],
    queryFn: async () => {
      if (!params.destination || !params.courier) return null;
      
      const res = await fetch(api.shipping.cost.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      
      if (!res.ok) throw new Error("Gagal cek ongkir");
      return api.shipping.cost.responses[200].parse(await res.json());
    },
    enabled: !!params.destination && !!params.courier,
  });
}
