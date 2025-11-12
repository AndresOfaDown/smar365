// src/presentation/views/client/ProductListPage.jsx
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";

export const ProductListPage = () => {
  const [search, setSearch] = useState("");
  const products = [
    { id: 1, name: "Headphones", price: "99.99", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Smart Watch", price: "199.99", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Laptop", price: "899.99", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Smart Speaker", price: "49.99", image: "https://via.placeholder.com/150" },
  ];

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">All Products</h2>

      <input
        type="text"
        placeholder="Search product..."
        className="border rounded-lg px-4 py-2 mb-6 w-full md:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} image={p.image} name={p.name} price={p.price} />
        ))}
      </div>
    </section>
  );
};
