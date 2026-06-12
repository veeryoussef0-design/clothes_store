import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getById, products, type Product } from "../lib/products";
import { StoreHeader } from "../components/StoreHeader";
import { useCart } from "../lib/cart";
import { ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => {
    const p = getById(params.productId);
    return { meta: [{ title: `${p?.name ?? "المنتج"} - متجر الأناقة` }] };
  },
  loader: ({ params }) => {
    const product = getById(params.productId);
    if (!product) throw notFound();
    const related = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
    return { product, related };
  },
  component: ProductDetails,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">المنتج غير موجود</p>
        <Link to="/categories" className="mt-4 inline-block text-primary underline">العودة</Link>
      </div>
    </div>
  ),
  errorComponent: () => <div className="p-10 text-center">حدث خطأ</div>,
});

function ProductDetails() {
  const { product, related } = Route.useLoaderData();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/categories" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> رجوع
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]">
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-primary sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{product.type}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-black text-primary">{product.price}</span>
              <span className="text-lg text-muted-foreground">ج.م</span>
            </div>

            <div className="mt-8 space-y-3 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
              <Detail label="النوع" value={product.type} />
              <Detail label="الخامة" value={product.material} />
              <Detail label="المقاسات المتاحة" value="S, M, L, XL, XXL" />
              <Detail label="التوصيل" value="2 - 5 أيام عمل لجميع المحافظات" />
              <Detail label="الاستبدال والاسترجاع" value="خلال 14 يوم من الاستلام" />
            </div>

            <div className="mt-6 rounded-2xl bg-accent/20 p-5">
              <h3 className="font-bold text-primary">وصف المنتج</h3>
              <p className="mt-2 leading-relaxed text-foreground/80">
                {product.name} مصنوع من {product.material} عالى الجودة، مريح فى الاستخدام اليومى
                ومناسب لكل المناسبات. تصميم عصرى يجمع بين الأناقة والراحة، متوفر بمقاسات مختلفة.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              <Link
                to="/order/$productId"
                params={{ productId: product.id }}
                className="block rounded-2xl bg-primary py-4 text-center text-lg font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                اطلب الآن
              </Link>
              <button
                type="button"
                onClick={handleAdd}
                className={`flex items-center justify-center gap-2 rounded-2xl border-2 py-3.5 text-base font-bold transition-all ${
                  added
                    ? "border-[#25D366] bg-[#25D366]/10 text-[#25D366]"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                {added ? "تم الإضافة للسلة" : "أضف للسلة"}
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-primary">منتجات مشابهة</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p: Product) => (
                <Link
                  key={p.id}
                  to="/product/$productId"
                  params={{ productId: p.id }}
                  className="group overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground">{p.name}</h3>
                    <p className="mt-1 font-black text-primary">{p.price} ج.م</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-end font-semibold text-foreground">{value}</span>
    </div>
  );
}
