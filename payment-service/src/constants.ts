export const SERVICES = {
  PAYMENT: process.env.PAYMENT_SERVICE ?? 'payment-service',
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
  STRIPE: process.env.STRIPE_SERVICE ?? 'stripe-service',
  USER: process.env.USER_SERVICE ?? 'user-service',
  MAILER: process.env.MAILER_SERVICE ?? 'mailer-service',
};

export const PORTS = {
  PAYMENT: parseInt(process.env.PAYMENT_PORT) ?? 3000,
};

export const FRONT_URL = process.env.FRONT_URL ?? 'http://localhost:8080';
