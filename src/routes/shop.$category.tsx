import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { categoryLabels, getByCategory, type Product } from "../lib/products";
import { StoreHeader } from "../components/StoreHeader";
import { useCart } from "../lib/cart";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/shop/$category")({
  head: ({ params }) => ({
    meta: [{ title: `${categoryLabels[params.category] ?? "المنتجات"} - متجر الأناقة` }],
  }),
  loader: ({ params }) => {
    const label = categoryLabels[params.category];
    if (!label) throw notFound();
    return { label, items: getByCategory(params.category) };
  },
  component: Shop,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">القسم غير موجود</p>
        <Link to="/categories" className="mt-4 inline-block text-primary underline">العودة للأقسام</Link>
      </div>
    </div>
  ),
  errorComponent: () => <div className="p-10 text-center">حدث خطأ</div>,
});

function Shop() {
  const { label, items } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link to="/categories" className="text-sm text-muted-foreground hover:text-primary">← الأقسام</Link>
        <h1 className="mt-6 text-center text-4xl font-black text-primary sm:text-5xl">{label}</h1>
        <p className="mt-3 text-center text-muted-foreground">{items.length} منتج متاح</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p: Product) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    add(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <div className="aspect-square overflow-hidden bg-muted">
        <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-primary">{p.name}</h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>النوع: <span className="text-foreground">{p.type}</span></p>
          <p>الخامة: <span className="text-foreground">{p.material}</span></p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-black text-primary">{p.price} <span className="text-sm font-normal">ج.م</span></span>
        </div>
        <div className="mt-4 grid gap-2">
          <Link
            to="/product/$productId"
            params={{ productId: p.id }}
            className="block rounded-xl bg-primary py-3 text-center font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            عرض المنتج
          </Link>
          <button
            type="button"
            onClick={handleAdd}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold transition-all ${
              added
                ? "border-[#25D366] bg-[#25D366]/10 text-[#25D366]"
                : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            {added ? "تم الإضافة" : "أضف للسلة"}
          </button>
        </div>
      </div>
    </div>
  );
}
