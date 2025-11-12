// src/presentation/views/client/ProductDetailPage.jsx
export const ProductDetailPage = () => {
  const product = {
    name: "Wireless Headphones",
    price: "99.99",
    image: "https://via.placeholder.com/250",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque lorem sed nulla facilisis, eget vulputate justo varius.",
  };

  return (
    <section className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
      <img
        src={product.image}
        alt={product.name}
        className="w-full md:w-1/2 rounded-lg shadow"
      />
      <div className="flex flex-col justify-center w-full md:w-1/2">
        <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
        <p className="text-blue-600 text-xl font-semibold mt-2">
          ${product.price}
        </p>
        <p className="text-gray-600 mt-4">{product.description}</p>

        <div className="mt-6">
          <label className="block mb-1 text-gray-700 font-medium">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            defaultValue="1"
            className="border rounded-lg w-24 px-3 py-2"
          />
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </section>
  );
};
