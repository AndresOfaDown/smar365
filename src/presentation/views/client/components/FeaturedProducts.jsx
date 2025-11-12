// src/presentation/components/FeaturedProducts.jsx
import { ProductCard } from "./ProductCard";

export const FeaturedProducts = () => {
  const offers = [
    {
      id: 1,
      name: "Smart TV 50'' 4K UHD",
      price: "499.99",
      discount: "399.99",
      image:
        "https://images.unsplash.com/photo-1593359677879-9224c95b5f87?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Bluetooth Headphones",
      price: "99.99",
      discount: "69.99",
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Smart Watch Pro",
      price: "199.99",
      discount: "149.99",
      image:
        "https://images.unsplash.com/photo-1606220838311-05c3be0f51b7?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Smart Speaker Mini",
      price: "49.99",
      discount: "34.99",
      image:
        "https://images.unsplash.com/photo-1618365908648-eda4d4815a86?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Hot Deals & Offers
      </h2>
      <p className="text-gray-600 mb-8">
        Get the best prices on top electronics — limited-time offers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {offers.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition duration-200 cursor-pointer relative overflow-hidden"
          >
            {/* Etiqueta de descuento */}
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </span>

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            <h3 className="font-semibold text-gray-700 text-center">
              {item.name}
            </h3>

            <div className="flex justify-center gap-2 items-center">
              <span className="text-gray-400 line-through text-sm">
                ${item.price}
              </span>
              <span className="text-blue-600 font-bold">
                ${item.discount}
              </span>
            </div>

            <div className="flex justify-center mt-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
