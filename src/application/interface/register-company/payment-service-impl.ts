export interface CreateOrderParams {
  amount:   number;   // smallest currency unit (paise / cents)
  currency: string;
  receipt?: string;
}

export interface StripePaymentResult {
  clientSecret:    string;
  paymentIntentId: string;
}

export interface RazorpayOrderResult {
  orderId:  string;
  amount:   number;
  currency: string;
  keyId:    string;
}

export interface IPaymentService {
  // Stripe
  createStripePaymentIntent(params: CreateOrderParams): Promise<StripePaymentResult>;
  verifyStripePayment(paymentIntentId: string): Promise<{ success: boolean; receiptUrl?: string }>;
}