import { Link } from "@tanstack/react-router";
import { StoreHeader } from "./StoreHeader";

type Item = { slug: string; name: string; image: string };

export function SubcategoryGrid({ title, backTo, items }: { title: string; backTo: string; items: Item[] }) {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link to={backTo} className="text-sm text-muted-foreground hover:text-primary">← رجوع</Link>
        <h1 className="mt-6 text-center text-4xl font-black text-primary sm:text-5xl">{title}</h1>
        <p className="mt-3 text-center text-muted-foreground">اختر النوع اللى يناسبك</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.slug}
              to="/shop/$category"
              params={{ category: item.slug }}
              className="group relative block h-64 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-white">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary transition-transform group-hover:-translate-x-1">←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
