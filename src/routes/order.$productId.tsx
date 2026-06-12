import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getById } from "../lib/products";
import { MapLocationPicker } from "../components/MapLocationPicker";
import { saveOrder } from "../lib/orders";

export const Route = createFileRoute("/order/$productId")({
  head: () => ({ meta: [{ title: "إتمام الطلب - متجر الأناقة" }] }),
  loader: ({ params }) => {
    const product = getById(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  component: Order,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p>المنتج غير موجود</p>
    </div>
  ),
  errorComponent: () => <div className="p-10 text-center">حدث خطأ</div>,
});

const sizes = ["S", "M", "L", "XL", "XXL"];
const paymentMethods = [
  { id: "cod", label: "الدفع عند الاستلام" },
  { id: "vodafone", label: "فودافون كاش" },
  { id: "instapay", label: "InstaPay" },
];

function Order() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const [size, setSize] = useState("M");
  const [payment, setPayment] = useState("cod");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await saveOrder({
        customer_name: name,
        customer_phone: phone,
        items: [{ product, qty: 1, size }],
        total: product.price,
        status: "pending",
      });
      setDone(true);
    } catch (error) {
      console.error("Save order failed", error);
      alert("حدث خطأ أثناء حفظ الطلب. حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md rounded-3xl bg-card p-10 text-center shadow-[var(--shadow-elegant)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-4xl">✓</div>
          <h2 className="mt-6 text-2xl font-black text-primary">تم استلام طلبك!</h2>
          <p className="mt-3 text-muted-foreground">هنتواصل معاك على {phone} لتأكيد الطلب</p>
          <button onClick={() => navigate({ to: "/categories" })} className="mt-8 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground">
            متابعة التسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link to="/categories" className="text-sm text-muted-foreground hover:text-primary">← الأقسام</Link>
        <h1 className="mt-6 text-3xl font-black text-primary sm:text-4xl">إتمام الطلب</h1>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
          <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
          <div className="flex-1">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-muted-foreground">{product.type} • {product.material}</p>
          </div>
          <span className="text-2xl font-black text-primary">{product.price} ج.م</span>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-8 rounded-2xl bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <section>
            <h3 className="text-lg font-bold text-primary">المقاس</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)}
                  className={`h-12 w-14 rounded-xl border-2 font-bold transition-all ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-primary">طريقة الدفع</h3>
            <div className="mt-3 space-y-2">
              {paymentMethods.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${payment === m.id ? "border-primary bg-accent/20" : "border-border hover:border-primary/50"}`}>
                  <input type="radio" name="pay" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="h-5 w-5 accent-[oklch(0.28_0.08_25)]" />
                  <span className="font-semibold">{m.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-primary">بيانات التواصل</h3>
            <Field label="الاسم بالكامل" value={name} onChange={setName} required />
            <Field label="رقم الهاتف" value={phone} onChange={setPhone} required type="tel" />
            <Field label="العنوان بالتفصيل" value={address} onChange={setAddress} required textarea />
          </section>

          <section>
            <h3 className="text-lg font-bold text-primary">موقع التوصيل</h3>
            <p className="mt-1 text-sm text-muted-foreground">اضغط على الخريطة أو اسحب الدبوس لتحديد موقعك بدقة</p>
            <div className="mt-3">
              <MapLocationPicker value={location} onChange={setLocation} />
            </div>
          </section>

          <button type="submit" className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg">
            تأكيد الطلب
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, type = "text", textarea }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; textarea?: boolean }) {
  const cls = "w-full rounded-xl border-2 border-border bg-background px-4 py-3 outline-none transition-all focus:border-primary";
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} rows={3} className={cls} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={cls} />
      )}
    </label>
  );
}
