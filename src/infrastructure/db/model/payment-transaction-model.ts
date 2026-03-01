import mongoose, { Schema } from "mongoose";
import type { IPaymentTransaction } from "../../../domain/entities/PaymentTransaction.js";

export interface IPaymentTransactionDocument extends Omit<IPaymentTransaction, '_id'>, Document {}

const PaymentTransactionSchema = new Schema<IPaymentTransactionDocument>(
  {
    companyId:          { type: String, ref: 'Company', required: true },
    totalAmount:        { type: Number, required: true },
    paymentStatus:      { type: String, required: true },
    subtotalAmount:     { type: Number, required: true },
    taxAmount:          { type: Number, default: 0 },
    currency:           { type: String, required: true, default: 'INR' },
    paymentMethod:      { type: String },
    receiptUrl:         { type: String },
    paidAt:             { type: Date },
    paymentType:        { type: String, required: true }, 
    gatewayOrderId:     { type: String },
    gatewayPaymentId:   { type: String },
    gateway:            { type: String, default: 'stripe'},
    purchasedModules:   [{ type: String }],
    billingCycleMonths: { type: Number, default: 1},
  },
  { timestamps: true }
);

export const PaymentTransactionModel = mongoose.model<IPaymentTransactionDocument>(
  'PaymentTransaction',
  PaymentTransactionSchema
);