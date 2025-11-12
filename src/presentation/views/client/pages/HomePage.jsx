import { DiscountProducts } from "../components/DiscountProducts";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { HeroSection } from "../components/HeroSection";
import { ProductGrid } from "../components/ProductGrid";
import { useState } from "react";
import { LoginModal } from "../../auth/LoginModal";
import { RegisterModal } from "../../auth/RegisterModal";

export const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <section className="container mx-auto px-6 py-12">
      {/* 🔹 Botones superiores */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => setShowLogin(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => setShowRegister(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Registrarse
        </button>
      </div>

      {/* 🔹 Contenido principal */}
      <div className="flex flex-col md:flex-row items-start gap-10">
        <div className="flex-1">
          <HeroSection />
        </div>
        <div className="flex-1">
          <ProductGrid />
        </div>
      </div>

      <FeaturedProducts />
      <DiscountProducts />

      {/* 🔹 Modales */}
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal show={showRegister} onClose={() => setShowRegister(false)} />
    </section>
  );
};
