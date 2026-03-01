import mongoose, { Schema } from "mongoose";
import type { ISubscriptionHistory } from "../../../domain/entities/SubscriptionHistory.js";

export interface ISubscriptionHistoryDocument extends Omit<ISubscriptionHistory, '_id'>, Document {}

const SubscriptionHistorySchema = new Schema<ISubscriptionHistoryDocument>(
  {
    purchasedModules: [{ type: String }],
    companyId:        { type: String, ref: 'Company', required: true },
    transactionId:    { type: String, ref: 'PaymentTransaction', required: true },
    price:            { type: String, required: true },
    startDate:        { type: Date, required: true },
    endDate:          { type: Date, required: true },
  },
  { timestamps: true }
);

export const SubscriptionHistoryModel = mongoose.model<ISubscriptionHistoryDocument>(
  'SubscriptionHistory',
  SubscriptionHistorySchema
);




