# Integración con Stripe

## Instalación de dependencias

### Backend (Python)
```bash
cd Backend/Bakent365
env\Scripts\activate
pip install stripe
```

### Frontend (React)
```bash
cd Frontend/smar365
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Configuración

### Backend
- Clave secreta agregada en `ventas/stripe_service.py`
- Endpoints creados en `ventas/views.py`:
  - `POST /api/stripe/create-payment-intent/` - Crear PaymentIntent
  - `POST /api/stripe/confirm-payment/` - Confirmar pago

### Frontend
- Clave pública en `Services/Pasarela/ApiStripe.js`
- Componente de checkout en `CheckoutPage.jsx`

## Uso

1. Usuario agrega productos al carrito
2. Va al checkout
3. Ingresa datos de tarjeta
4. Se procesa el pago con Stripe
5. Se crea la venta en la BD

## Tarjetas de prueba

- **Éxito**: 4242 4242 4242 4242
- **Requiere auth**: 4000 0025 0000 3155
- **Decline**: 4000 0000 0000 9995

**Fecha**: Cualquier fecha futura
**CVC**: Cualquier 3 dígitos
**ZIP**: Cualquier 5 dígitos
