// src/presentation/views/client/OrdersPage.jsx
export const OrdersPage = () => {
  const orders = [
    { id: 1, date: "2025-10-12", total: "299.99", status: "Delivered" },
    { id: 2, date: "2025-09-30", total: "99.99", status: "Processing" },
  ];

  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-3">{o.id}</td>
              <td className="p-3">{o.date}</td>
              <td className="p-3">${o.total}</td>
              <td className="p-3">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
