import { loadStripe } from '@stripe/stripe-js';
import { api } from '../../api/api';

// ✅ Clave publicable de Stripe
const STRIPE_PUBLIC_KEY = 'pk_test_51SOpP3D9rf9HDuNt9TsnKuj0utwp2knkDjBsK4yTzYiUiPgDVPXLul7OjzJo4Ay7Qeh8p47bFsOJiDsAJPay4X9d00b6hzbYm7';

// Inicializar Stripe
let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

/**
 * Crear PaymentIntent en el backend
 * @returns {Promise<Object>} client_secret y payment_intent_id
 */
export const createPaymentIntent = async () => {
  try {
    const response = await api.post('stripe/create-payment-intent/');
    return response.data;
  } catch (error) {
    console.error('Error al crear Payment Intent:', error);
    throw error;
  }
};

/**
 * Confirmar el pago en el backend después de Stripe
 * @param {string} paymentIntentId - ID del PaymentIntent
 * @param {string} nit - NIT del cliente (opcional)
 * @returns {Promise<Object>} Información de la venta
 */
export const confirmPayment = async (paymentIntentId, nit = null) => {
  try {
    const response = await api.post('stripe/confirm-payment/', {
      payment_intent_id: paymentIntentId,
      nit: nit
    });
    return response.data;
  } catch (error) {
    console.error('Error al confirmar pago:', error);
    throw error;
  }
};

/**
 * Procesar pago con Stripe (flujo completo)
 * @param {Object} cardElement - Elemento de tarjeta de Stripe
 * @param {string} nit - NIT del cliente (opcional)
 * @returns {Promise<Object>} Resultado del pago
 */
export const processStripePayment = async (cardElement, nit = null) => {
  try {
    // 1. Obtener Stripe
    const stripe = await getStripe();

    // 2. Crear PaymentIntent en el backend
    const { client_secret, payment_intent_id, amount } = await createPaymentIntent();

    // 3. Confirmar el pago con Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // 4. Confirmar en el backend que el pago fue exitoso
    if (paymentIntent.status === 'succeeded') {
      const ventaData = await confirmPayment(payment_intent_id, nit);
      return {
        success: true,
        paymentIntent,
        venta: ventaData
      };
    } else {
      throw new Error('El pago no fue completado');
    }

  } catch (error) {
    console.error('Error al procesar pago:', error);
    return {
      success: false,
      error: error.message || 'Error al procesar el pago'
    };
  }
};

export default {
  getStripe,
  createPaymentIntent,
  confirmPayment,
  processStripePayment
};
