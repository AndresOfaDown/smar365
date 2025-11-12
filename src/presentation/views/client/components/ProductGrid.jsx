// src/presentation/components/ProductGrid.jsx
import { ProductCard } from "./ProductCard";

export const ProductGrid = () => {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "99.99",
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "199.99",
      image:
        "https://images.unsplash.com/photo-1606220838311-05c3be0f51b7?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      name: "Smart Speaker",
      price: "49.99",
      image:
        "https://images.unsplash.com/photo-1618365908648-eda4d4815a86?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      name: "Tablet Pro",
      price: "299.99",
      image:
        "https://images.unsplash.com/photo-1585792180666-1400e01a7d1d?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          image={p.image}
          name={p.name}
          price={p.price}
        />
      ))}
    </div>
  );
};
