import { createFileRoute } from "@tanstack/react-router";
import { SubcategoryGrid } from "../components/SubcategoryGrid";

export const Route = createFileRoute("/women")({
  head: () => ({ meta: [{ title: "ملابس حريمى" }] }),
  component: () => (
    <SubcategoryGrid
      title="ملابس حريمى"
      backTo="/categories"
      items={[
        { slug: "women-tshirts", name: "تيشيرتات", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80" },
        { slug: "women-pants", name: "بناطيل", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" },
        { slug: "women-blouses", name: "بلوزات", image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80" },
        { slug: "women-dresses", name: "فساتين", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80" },
      ]}
    />
  ),
});
