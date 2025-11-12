export const ProductCard = ({ image, name, price }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition duration-200 cursor-pointer">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="font-semibold text-gray-700 text-center">{name}</h3>
      <p className="text-blue-600 font-bold text-center">${price}</p>
    </div>
  );
};
