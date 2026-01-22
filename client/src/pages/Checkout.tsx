import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle, Truck, MapPin, CreditCard } from "lucide-react";
import { shippingSchema } from "@shared/schema";
import { api } from "@shared/routes";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useProvinces, useCities, useShippingCost } from "@/hooks/use-shipping";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";

// Step Components
function Step1Address({ form, onNext }: any) {
  const { data: provinces } = useProvinces();
  const selectedProvince = form.watch("province");
  const { data: cities } = useCities(selectedProvince?.split(",")[0]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Depan</label>
          <input {...form.register("firstName")} className="w-full p-3 rounded-xl border border-input focus:ring-2 focus:ring-primary/20 outline-none" placeholder="John" />
          {form.formState.errors.firstName && <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Belakang</label>
          <input {...form.register("lastName")} className="w-full p-3 rounded-xl border border-input focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Doe" />
          {form.formState.errors.lastName && <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nomor Telepon</label>
        <input {...form.register("phone")} className="w-full p-3 rounded-xl border border-input focus:ring-2 focus:ring-primary/20 outline-none" placeholder="08123456789" />
        {form.formState.errors.phone && <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Alamat Lengkap</label>
        <textarea {...form.register("address")} rows={3} className="w-full p-3 rounded-xl border border-input focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Jl. Sudirman No. 1..." />
        {form.formState.errors.address && <p className="text-xs text-red-500">{form.formState.errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Provinsi</label>
          <select 
            {...form.register("province")} 
            className="w-full p-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary/20 outline-none"
            onChange={(e) => {
              form.setValue("province", e.target.value);
              form.setValue("city", ""); // Reset city
            }}
          >
            <option value="">Pilih Provinsi</option>
            {provinces?.map((p: any) => (
              <option key={p.province_id} value={`${p.province_id},${p.province}`}>
                {p.province}
              </option>
            ))}
          </select>
          {form.formState.errors.province && <p className="text-xs text-red-500">{form.formState.errors.province.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kota/Kabupaten</label>
          <select {...form.register("city")} className="w-full p-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary/20 outline-none" disabled={!selectedProvince}>
            <option value="">Pilih Kota</option>
            {cities?.map((c: any) => (
              <option key={c.city_id} value={`${c.city_id},${c.type} ${c.city_name}`}>
                {c.type} {c.city_name}
              </option>
            ))}
          </select>
          {form.formState.errors.city && <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Kode Pos</label>
        <input {...form.register("postalCode")} className="w-full p-3 rounded-xl border border-input focus:ring-2 focus:ring-primary/20 outline-none" placeholder="12345" />
        {form.formState.errors.postalCode && <p className="text-xs text-red-500">{form.formState.errors.postalCode.message}</p>}
      </div>

      <button 
        type="button" 
        onClick={onNext}
        className="w-full py-3 bg-primary text-white rounded-xl font-medium mt-4 hover:bg-primary/90 transition-colors"
      >
        Lanjut ke Pengiriman
      </button>
    </div>
  );
}

function Step2Shipping({ form, onNext, onBack }: any) {
  const city = form.watch("city");
  const cityId = city ? city.split(",")[0] : null;
  const [courier, setCourier] = useState<string>("jne");

  // Mock origin (Jakarta Pusat = 152)
  const { data: costs, isLoading } = useShippingCost({
    origin: "152", 
    destination: cityId,
    weight: 1000, // Hardcoded 1kg for demo
    courier: courier
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium">Pilih Kurir</label>
        <div className="grid grid-cols-3 gap-3">
          {["jne", "pos", "tiki"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCourier(c)}
              className={`p-3 rounded-xl border text-sm font-medium uppercase transition-colors ${
                courier === c ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Layanan Pengiriman</label>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : costs?.[0]?.costs.length === 0 ? (
          <p className="text-sm text-red-500">Tidak ada layanan tersedia untuk rute ini.</p>
        ) : (
          costs?.[0]?.costs.map((service: any, idx: number) => (
            <label key={idx} className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors">
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="service"
                  className="w-4 h-4 text-primary"
                  onChange={() => {
                    form.setValue("courier", courier);
                    form.setValue("service", service.service);
                    form.setValue("shippingCost", service.cost[0].value);
                  }}
                  checked={form.watch("service") === service.service && form.watch("courier") === courier}
                />
                <div>
                  <p className="font-medium text-sm">{service.service}</p>
                  <p className="text-xs text-muted-foreground">{service.description} ({service.cost[0].etd} hari)</p>
                </div>
              </div>
              <p className="font-medium text-sm">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(service.cost[0].value)}
              </p>
            </label>
          ))
        )}
        {form.formState.errors.service && <p className="text-xs text-red-500">Pilih layanan pengiriman</p>}
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          type="button" 
          onClick={onBack}
          className="w-1/3 py-3 border border-input rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
        <button 
          type="button" 
          onClick={onNext}
          className="w-2/3 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          disabled={!form.watch("service")}
        >
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  );
}

function Step3Confirm({ form, onSubmit, onBack, items, total, isPending }: any) {
  const shippingCost = form.watch("shippingCost") || 0;
  const grandTotal = total + shippingCost;

  const formatPrice = (val: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Detail Pesanan</h3>
        {items.map((item: any) => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.product.name}</span>
            <span>{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
        <div className="h-px bg-gray-200 my-2" />
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Pengiriman ({form.watch("courier").toUpperCase()} - {form.watch("service")})</span>
          <span>{formatPrice(shippingCost)}</span>
        </div>
        <div className="h-px bg-gray-200 my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total Bayar</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-700">
          Metode pembayaran akan diarahkan ke Tripay setelah konfirmasi.
        </p>
      </div>

      <div className="flex gap-4">
        <button 
          type="button" 
          onClick={onBack}
          className="w-1/3 py-3 border border-input rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
        <button 
          type="button" 
          onClick={onSubmit}
          disabled={isPending}
          className="w-2/3 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          {isPending ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
          Konfirmasi Pesanan
        </button>
      </div>
    </div>
  );
}

export default function Checkout() {
  const [step, setStep] = useState(1);
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingCost: 0,
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.orders.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Silakan login terlebih dahulu");
        throw new Error("Gagal membuat pesanan");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Pesanan Berhasil!",
        description: "Terima kasih telah berbelanja di Valieria Decord.",
      });
      clearCart();
      setLocation("/");
    },
    onError: (err: any) => {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive"
      });
      if (err.message.includes("login")) {
        // Redirect to login if unauthorized
        window.location.href = "/api/login";
      }
    }
  });

  const handleNext = async () => {
    const fields = step === 1 
      ? ["firstName", "lastName", "phone", "address", "province", "city", "postalCode"]
      : ["courier", "service", "shippingCost"];
      
    const valid = await form.trigger(fields as any);
    if (valid) setStep(step + 1);
  };

  const handleSubmit = form.handleSubmit((data) => {
    createOrderMutation.mutate({
      shippingDetails: data,
      items: items.map(i => ({ productId: i.product.id, quantity: i.quantity }))
    });
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">Keranjang Kosong</h2>
        <Link href="/products" className="text-primary hover:underline">Kembali Belanja</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-8 text-center">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= 1 ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className={`w-16 h-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-100"}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= 2 ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
              <Truck className="w-5 h-5" />
            </div>
            <div className={`w-16 h-1 rounded-full ${step >= 3 ? "bg-primary" : "bg-gray-100"}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= 3 ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
          {step === 1 && <Step1Address form={form} onNext={handleNext} />}
          {step === 2 && <Step2Shipping form={form} onNext={handleNext} onBack={() => setStep(1)} />}
          {step === 3 && <Step3Confirm 
            form={form} 
            onSubmit={handleSubmit} 
            onBack={() => setStep(2)} 
            items={items} 
            total={total}
            isPending={createOrderMutation.isPending}
          />}
        </div>
      </main>
    </div>
  );
}
