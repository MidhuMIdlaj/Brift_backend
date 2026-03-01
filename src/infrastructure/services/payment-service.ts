import Stripe   from 'stripe';
import Razorpay from 'razorpay';
import crypto   from 'crypto';
import type { CreateOrderParams, IPaymentService, RazorpayOrderResult, StripePaymentResult } from '../../application/interface/register-company/payment-service-impl.js';

export class PaymentService implements IPaymentService {
  private _stripe: Stripe | null = null;

  private get stripe(): Stripe {
    if (!this._stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) throw new Error('STRIPE_SECRET_KEY is not set in .env');
      this._stripe = new Stripe(key, { apiVersion: '2026-01-28.clover' });
    }
    return this._stripe;
  }

  async createStripePaymentIntent(params: CreateOrderParams): Promise<StripePaymentResult> {
    const intent = await this.stripe.paymentIntents.create({
      amount:   params.amount,
      currency: params.currency,
      metadata: { receipt: params.receipt || '' },
      automatic_payment_methods: { enabled: true },
    });
    return {
      clientSecret:    intent.client_secret!,
      paymentIntentId: intent.id,
    };
  }

  async verifyStripePayment(
    paymentIntentId: string
  ): Promise<{ success: boolean; receiptUrl?: string }> {
    console.log('Verifying Stripe payment for intent ID:', paymentIntentId);
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    console.log(intent.status, "3234");
    if (intent.status !== 'succeeded') return { success: false };
    let receiptUrl: string | undefined;
    if (intent.latest_charge) {
      const charge = await this.stripe.charges.retrieve(intent.latest_charge as string);
      receiptUrl   = charge.receipt_url ?? undefined;
    }
    return { success: true, receiptUrl };
  }
}