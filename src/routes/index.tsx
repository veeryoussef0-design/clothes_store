import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "متجر الأناقة - مرحباً بك" },
      { name: "description", content: "متجرك الأول للملابس الرجالى والحريمى" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.82 0.13 80) 0%, transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.7 0.16 60) 0%, transparent 50%)"
      }} />
      <div className="relative z-10 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Welcome</p>
        <h1 className="text-5xl font-black leading-tight text-white sm:text-7xl md:text-8xl">
          مرحباً فى متجرنا
          <br />
          <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            للبيع
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-white/80">
          اكتشف أحدث صيحات الموضة فى الملابس الرجالى والحريمى
        </p>
        <Link
          to="/categories"
          className="mt-12 inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-lg font-bold text-primary shadow-2xl transition-all hover:scale-105 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.5)]"
        >
          ابدأ
          <span className="text-2xl">←</span>
        </Link>
      </div>
    </div>
  );
}
