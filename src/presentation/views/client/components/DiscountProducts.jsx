// src/presentation/components/DiscountProducts.jsx
import { FaTag } from "react-icons/fa";

export const DiscountProducts = () => {
  const discountedProducts = [
    {
      id: 1,
      name: "Smart Refrigerator",
      price: 999.99,
      discountPrice: 799.99,
      image:
        "https://images.unsplash.com/photo-1606813902794-0b5e96e19c67?auto=format&fit=crop&w=600&q=80",
      discountPercent: 20,
    },
    {
      id: 2,
      name: "Noise Cancelling Headphones",
      price: 199.99,
      discountPrice: 149.99,
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=600&q=80",
      discountPercent: 25,
    },
    {
      id: 3,
      name: "Smart Watch 8 Pro",
      price: 249.99,
      discountPrice: 199.99,
      image:
        "https://images.unsplash.com/photo-1606220838311-05c3be0f51b7?auto=format&fit=crop&w=600&q=80",
      discountPercent: 20,
    },
    {
      id: 4,
      name: "4K LED TV 55''",
      price: 599.99,
      discountPrice: 499.99,
      image:
        "https://images.unsplash.com/photo-1593359677879-9224c95b5f87?auto=format&fit=crop&w=600&q=80",
      discountPercent: 17,
    },
  ];

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaTag className="text-blue-600" /> Products with Discounts
        </h2>
        <p className="text-gray-500 text-sm">
          Grab these amazing deals before they’re gone!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {discountedProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition duration-200 overflow-hidden relative"
          >
            {/* Etiqueta de descuento */}
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{item.discountPercent}%
            </div>

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-44 object-cover"
            />

            <div className="p-4 text-center">
              <h3 className="text-gray-800 font-semibold mb-2">{item.name}</h3>
              <div className="flex justify-center gap-2 items-center mb-3">
                <span className="text-gray-400 line-through text-sm">
                  ${item.price}
                </span>
                <span className="text-blue-600 font-bold text-lg">
                  ${item.discountPrice}
                </span>
              </div>

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
