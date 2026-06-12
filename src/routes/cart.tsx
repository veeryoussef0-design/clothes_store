import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreHeader } from "../components/StoreHeader";
import { useCart, whatsappUrl } from "../lib/cart";
import { saveOrder } from "../lib/orders";
import { Minus, Plus, Trash2, MessageCircle, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "السلة - متجر الأناقة" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const orderMessage = () => {
    if (items.length === 0) return "";
    const lines = items.map(
      (x) => `• ${x.product.name} × ${x.qty} = ${x.qty * x.product.price} ج.م`,
    );
    return `مرحباً، أريد طلب المنتجات التالية:\n\n${lines.join("\n")}\n\nالإجمالى: ${total} ج.م`;
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !customerName || !customerPhone) return;

    setIsLoading(true);
    try {
      // حفظ الطلب في Supabase
      await saveOrder({
        customer_name: customerName,
        customer_phone: customerPhone,
        items,
        total,
        status: "pending",
      });

      // عرض رسالة النجاح
      setOrderSuccess(true);
      
      // مسح البيانات بعد ثانية
      setTimeout(() => {
        setShowCheckout(false);
        setCustomerName("");
        setCustomerPhone("");
        setOrderSuccess(false);
        clear();
      }, 2000);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("حدث خطأ في حفظ الطلب. حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-black text-primary sm:text-4xl">سلة التسوق</h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-card p-12 text-center shadow-[var(--shadow-card)]">
            <p className="text-lg text-muted-foreground">السلة فارغة</p>
            <Link
              to="/categories"
              className="mt-6 inline-block rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground"
            >
              ابدأ التسوق
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 space-y-4">
              {items.map((x) => (
                <li
                  key={x.product.id + (x.size ?? "")}
                  className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center"
                >
                  <img
                    src={x.product.image}
                    alt={x.product.name}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="font-bold text-foreground">{x.product.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {x.product.type} • {x.product.material}
                    </p>
                    <p className="mt-1 font-black text-primary">{x.product.price} ج.م</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(x.product.id, x.qty - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-border hover:border-primary"
                      aria-label="نقص"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{x.qty}</span>
                    <button
                      onClick={() => setQty(x.product.id, x.qty + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-border hover:border-primary"
                      aria-label="زيادة"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(x.product.id)}
                      className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">الإجمالى</span>
                <span className="text-2xl font-black text-primary">{total} ج.م</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                disabled={items.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-lg font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="h-5 w-5" />
                إتمام الطلب
              </button>
              <a
                href={whatsappUrl(orderMessage())}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] py-3 text-sm font-semibold text-[#25D366] hover:bg-[#25D366]/5"
              >
                أو اطلب عبر واتساب
              </a>
              <button
                onClick={clear}
                className="mt-3 w-full rounded-xl border-2 border-border py-3 text-sm font-semibold text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                إفراغ السلة
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal للشراء */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
            {orderSuccess ? (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <span className="text-2xl">✓</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-foreground">تم الطلب بنجاح!</h2>
                <p className="mt-2 text-sm text-muted-foreground">سنتواصل معك قريباً</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">بيانات الطلب</h2>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      اسمك الكامل
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="أدخل اسمك"
                      required
                      className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="أدخل رقم هاتفك"
                      required
                      className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="my-4 rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">الإجمالى</p>
                    <p className="text-2xl font-black text-primary">{total} ج.م</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !customerName || !customerPhone}
                    className="w-full rounded-lg bg-[#25D366] py-3 font-bold text-white hover:bg-[#20ba5d] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "جاري الحفظ..." : "تأكيد الطلب"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-full rounded-lg border-2 border-border py-3 font-semibold text-foreground hover:bg-muted"
                  >
                    إلغاء
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
