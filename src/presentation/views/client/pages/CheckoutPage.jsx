// src/presentation/views/client/CheckoutPage.jsx
export const CheckoutPage = () => {
  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h2>

      <form className="bg-white shadow rounded-xl p-6 grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
          <input className="border rounded-lg w-full px-4 py-2" type="text" />

          <label className="block text-gray-700 mt-4 mb-1 font-medium">Email</label>
          <input className="border rounded-lg w-full px-4 py-2" type="email" />

          <label className="block text-gray-700 mt-4 mb-1 font-medium">Address</label>
          <input className="border rounded-lg w-full px-4 py-2" type="text" />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Payment Method</label>
          <select className="border rounded-lg w-full px-4 py-2">
            <option>Credit Card</option>
            <option>PayPal</option>
            <option>Stripe</option>
          </select>

          <div className="flex justify-between items-center mt-6 font-semibold text-lg">
            <span>Total</span>
            <span>$1,199.97</span>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 mt-6 rounded-lg hover:bg-blue-700">
            Confirm Payment
          </button>
        </div>
      </form>
    </section>
  );
};
