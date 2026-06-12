export type Product = {
  id: string;
  name: string;
  type: string;
  material: string;
  price: number;
  image: string;
  category: string;
};

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=600&q=80`;

export const categoryLabels: Record<string, string> = {
  "men-hoodies": "هوديز رجالى",
  "men-tshirts": "تيشيرتات رجالى",
  "men-pants": "بناطيل رجالى",
  "men-tracksuits": "ترانجات رجالى",
  "women-tshirts": "تيشيرتات حريمى",
  "women-pants": "بناطيل حريمى",
  "women-blouses": "بلوزات حريمى",
  "women-dresses": "فساتين حريمى",
};

const make = (cat: string, items: Omit<Product, "category" | "id">[]): Product[] =>
  items.map((p, i) => ({ ...p, category: cat, id: `${cat}-${i + 1}` }));

export const products: Product[] = [
  ...make("men-hoodies", [
    { name: "هودى أسود كلاسيك", type: "هودى", material: "قطن 100%", price: 650, image: img("photo-1556821840-3a63f95609a7") },
    { name: "هودى رمادى دافئ", type: "هودى", material: "قطن وبوليستر", price: 720, image: img("photo-1620799140408-edc6dcb6d633") },
    { name: "هودى بيج عصرى", type: "هودى", material: "قطن مخلوط", price: 690, image: img("photo-1542406775-ade58c52d2e4") },
  ]),
  ...make("men-tshirts", [
    { name: "تيشيرت أبيض بسيط", type: "تيشيرت", material: "قطن مصرى", price: 280, image: img("photo-1521572163474-6864f9cf17ab") },
    { name: "تيشيرت أسود بطبعة", type: "تيشيرت", material: "قطن 100%", price: 320, image: img("photo-1576566588028-4147f3842f27") },
    { name: "تيشيرت أزرق بحرى", type: "تيشيرت", material: "قطن نيمى", price: 300, image: img("photo-1583743814966-8936f5b7be1a") },
  ]),
  ...make("men-pants", [
    { name: "بنطلون جينز كلاسيك", type: "بنطلون جينز", material: "دنيم", price: 850, image: img("photo-1542272604-787c3835535d") },
    { name: "بنطلون كاچوال بيج", type: "بنطلون قطن", material: "قطن مرن", price: 720, image: img("photo-1473966968600-fa801b869a1a") },
  ]),
  ...make("men-tracksuits", [
    { name: "ترنج رياضى أسود", type: "ترنج", material: "بوليستر", price: 950, image: img("photo-1556906781-9a412961c28c") },
    { name: "ترنج رمادى مريح", type: "ترنج", material: "قطن مخلوط", price: 890, image: img("photo-1517438476312-10d79c077509") },
  ]),
  ...make("women-tshirts", [
    { name: "تيشيرت وردى ناعم", type: "تيشيرت", material: "قطن", price: 290, image: img("photo-1503342217505-b0a15ec3261c") },
    { name: "تيشيرت أبيض كروب", type: "تيشيرت كروب", material: "قطن مرن", price: 310, image: img("photo-1554568218-0f1715e72254") },
  ]),
  ...make("women-pants", [
    { name: "بنطلون جينز هاى ويست", type: "جينز", material: "دنيم", price: 880, image: img("photo-1541099649105-f69ad21f3246") },
    { name: "بنطلون واسع أسود", type: "بنطلون", material: "قطن", price: 760, image: img("photo-1594633312681-425c7b97ccd1") },
  ]),
  ...make("women-blouses", [
    { name: "بلوزة ساتان أنيقة", type: "بلوزة", material: "ساتان", price: 540, image: img("photo-1564257631407-4deb1f99d992") },
    { name: "بلوزة كاچوال بيضاء", type: "بلوزة", material: "قطن", price: 460, image: img("photo-1485518882345-15568b007407") },
  ]),
  ...make("women-dresses", [
    { name: "فستان صيفى مزهر", type: "فستان", material: "قطن خفيف", price: 980, image: img("photo-1572804013309-59a88b7e92f1") },
    { name: "فستان سهرة أسود", type: "فستان", material: "ساتان", price: 1450, image: img("photo-1595777457583-95e059d581b8") },
  ]),
];

export const getByCategory = (cat: string) => products.filter((p) => p.category === cat);
export const getById = (id: string) => products.find((p) => p.id === id);
