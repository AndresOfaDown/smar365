import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
      {/* Texto */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">SmartSales365</span>
        </h1>
        <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto md:mx-0">
          Discover our range of products for all your needs.
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};
