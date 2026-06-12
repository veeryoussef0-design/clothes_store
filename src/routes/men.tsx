import { createFileRoute } from "@tanstack/react-router";
import { SubcategoryGrid } from "../components/SubcategoryGrid";

export const Route = createFileRoute("/men")({
  head: () => ({ meta: [{ title: "ملابس رجالى" }] }),
  component: () => (
    <SubcategoryGrid
      title="ملابس رجالى"
      backTo="/categories"
      items={[
        { slug: "men-hoodies", name: "هوديز", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80" },
        { slug: "men-tshirts", name: "تيشيرتات", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80" },
        { slug: "men-pants", name: "بناطيل", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80" },
        { slug: "men-tracksuits", name: "ترانجات", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80" },
      ]}
    />
  ),
});
