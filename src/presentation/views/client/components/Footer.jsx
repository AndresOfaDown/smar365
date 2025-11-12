export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 py-10 px-6">
        {/* Columna 1 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">SmartSales365</h3>
          <p className="text-sm">
            Tu tienda confiable de tecnología y electrodomésticos.
          </p>
        </div>

        {/* Columna 2 */}
        

        {/* Columna 3 */}
        <div>
          <h4 className="text-white font-semibold mb-3">Ayuda</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-400">Contacto</a></li>
            <li><a href="#" className="hover:text-blue-400">Términos</a></li>
            <li><a href="#" className="hover:text-blue-400">Privacidad</a></li>
          </ul>
        </div>

        {/* Columna 4 */}
        <div>
          <h4 className="text-white font-semibold mb-3">Síguenos</h4>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-blue-400">🌐</a>
            <a href="#" className="hover:text-blue-400">🐦</a>
            <a href="#" className="hover:text-blue-400">📘</a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm border-t border-gray-700 py-3">
        © {new Date().getFullYear()} SmartSales365 — Todos los derechos reservados.
      </div>
    </footer>
  );
};
