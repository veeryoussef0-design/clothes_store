import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreHeader } from "../components/StoreHeader";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "الأقسام - متجر الأناقة" }] }),
  component: Categories,
});

function Categories() {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← الرئيسية</Link>
        <h1 className="mt-6 text-center text-4xl font-black text-primary sm:text-5xl">اختر القسم</h1>
        <p className="mt-3 text-center text-muted-foreground">تسوق حسب اهتمامك</p>

        <div className="mt-12 grid gap-6">
          <CategoryCard to="/men" title="ملابس رجالى" subtitle="هوديز • تيشيرتات • بناطيل • ترانجات" image="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1200&q=80" />
          <CategoryCard to="/women" title="ملابس حريمى" subtitle="تيشيرتات • بناطيل • بلوزات • فساتين" image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80" />
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ to, title, subtitle, image }: { to: string; title: string; subtitle: string; image: string }) {
  return (
    <Link
      to={to}
      className="group relative block h-64 overflow-hidden rounded-3xl shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)] sm:h-80"
    >
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
        <h2 className="text-3xl font-black sm:text-4xl">{title}</h2>
        <p className="mt-2 text-white/80">{subtitle}</p>
        <span className="mt-3 inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent">
          تصفح القسم ←
        </span>
      </div>
    </Link>
  );
}
