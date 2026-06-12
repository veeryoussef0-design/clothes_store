import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingCart, MessageCircle, X } from "lucide-react";
import { products, categoryLabels } from "../lib/products";
import { useCart, whatsappUrl, WHATSAPP_NUMBER } from "../lib/cart";

export function StoreHeader() {
  const navigate = useNavigate();
  const { count } = useCart();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          p.type.toLowerCase().includes(t) ||
          p.material.toLowerCase().includes(t) ||
          (categoryLabels[p.category] ?? "").toLowerCase().includes(t),
      )
      .slice(0, 8);
  }, [q]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link to="/categories" className="shrink-0 text-lg font-black text-primary sm:text-xl">
          متجر الأناقة
        </Link>

        {/* Extended search */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2 rounded-full border-2 border-border bg-background px-4 py-2.5 transition-all focus-within:border-primary focus-within:shadow-md">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="ابحث عن منتج... تيشيرت، هودى، فستان"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-muted-foreground hover:text-foreground"
                aria-label="مسح"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {open && q && (
            <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
              {results.length === 0 ? (
                <p className="p-5 text-center text-sm text-muted-foreground">لا توجد نتائج</p>
              ) : (
                <ul className="divide-y divide-border">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setOpen(false);
                          setQ("");
                          navigate({ to: "/order/$productId", params: { productId: p.id } });
                        }}
                        className="flex w-full items-center gap-3 p-3 text-right transition-colors hover:bg-muted"
                      >
                        <img src={p.image} alt={p.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold text-foreground">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {categoryLabels[p.category]} • {p.material}
                          </p>
                        </div>
                        <span className="shrink-0 font-bold text-primary">{p.price} ج.م</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* WhatsApp customer service */}
        <a
          href={whatsappUrl("مرحباً، أحتاج خدمة العملاء")}
          target="_blank"
          rel="noreferrer"
          className="hidden shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg sm:inline-flex"
          aria-label={`خدمة العملاء واتساب ${WHATSAPP_NUMBER}`}
        >
          <MessageCircle className="h-5 w-5" />
          خدمة العملاء
        </a>
        <a
          href={whatsappUrl("مرحباً، أحتاج خدمة العملاء")}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md sm:hidden"
          aria-label="خدمة العملاء"
        >
          <MessageCircle className="h-5 w-5" />
        </a>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-all hover:scale-105"
          aria-label="السلة"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-black text-accent-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
