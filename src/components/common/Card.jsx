/**
 * Componente Card reutilizable
 * Usado para mostrar contenido en tarjetas con diferentes variantes
 */
export const Card = ({ 
  children, 
  className = "", 
  hover = false,
  onClick = null 
}) => {
  const baseClasses = "bg-white rounded-lg shadow-md";
  const hoverClasses = hover ? "hover:shadow-lg transition duration-300 cursor-pointer" : "";
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = "" }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
