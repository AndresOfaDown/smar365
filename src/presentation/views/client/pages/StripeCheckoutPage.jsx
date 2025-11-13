import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getStripe, createPaymentIntent, confirmPayment } from '../../../../Services/Pasarela/ApiStripe';
import { useCart } from '../context/CartContext';
import { FaCreditCard, FaLock, FaSpinner } from 'react-icons/fa';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

// Componente del formulario de pago
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cartItems, getSubtotal, clearCart } = useCart();
  
  const [processing, setProcessing] = useState(false);
  const [nit, setNit] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setProcessing(true);

    try {
      // 1. Crear PaymentIntent en el backend
      const { client_secret, payment_intent_id, amount } = await createPaymentIntent();

      // 2. Confirmar el pago con Stripe usando la tarjeta
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
        setProcessing(false);
        return;
      }

      // 3. Verificar que el pago fue exitoso
      if (paymentIntent.status === 'succeeded') {
        // 4. Confirmar en el backend
        const ventaData = await confirmPayment(payment_intent_id, nit || null);
        
        toast.success('¡Pago exitoso! 🎉');
        clearCart();
        
        setTimeout(() => {
          navigate(`/cliente/ordenes/${ventaData.venta.id}`);
        }, 1500);
      }

    } catch (err) {
      console.error('Error al procesar pago:', err);
      toast.error(err.response?.data?.error || 'Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = getSubtotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumen del pedido */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Resumen del pedido</h3>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.nombre} x {item.cantidad || 1}
              </span>
              <span className="font-medium text-gray-900">
                Bs. {((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-900">Total:</span>
              <span className="text-blue-600">Bs. {subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NIT (opcional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NIT (opcional)
        </label>
        <input
          type="text"
          value={nit}
          onChange={(e) => setNit(e.target.value)}
          placeholder="Ingrese su NIT"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Información de tarjeta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FaCreditCard className="text-blue-600" />
          Información de la tarjeta
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Usa la tarjeta de prueba: 4242 4242 4242 4242
        </p>
      </div>

      {/* Botón de pago */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <FaLock />
            Pagar Bs. {subtotal.toFixed(2)}
          </>
        )}
      </button>

      {/* Información de seguridad */}
      <div className="text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <FaLock className="text-green-600" />
          Pago seguro procesado por Stripe
        </p>
      </div>
    </form>
  );
};

// Componente principal que envuelve con Stripe Elements
export const StripeCheckoutPage = () => {
  const stripePromise = getStripe();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FaCreditCard className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💳 Tarjetas de prueba:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Éxito:</strong> 4242 4242 4242 4242</li>
            <li>• <strong>Requiere autenticación:</strong> 4000 0025 0000 3155</li>
            <li>• <strong>Declinada:</strong> 4000 0000 0000 9995</li>
            <li>• <strong>Fecha:</strong> Cualquier fecha futura</li>
            <li>• <strong>CVC:</strong> Cualquier 3 dígitos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
