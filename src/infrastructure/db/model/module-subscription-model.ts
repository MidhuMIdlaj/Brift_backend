import mongoose, { Schema } from "mongoose";
import type { IModuleSubscription } from "../../../domain/entities/ModuleSubscription.js";

export interface IModuleSubscriptionDocument extends Omit<IModuleSubscription, '_id'>, Document {}

const ModuleSubscriptionSchema = new Schema<IModuleSubscriptionDocument>(
  {
    companyId:  { type: String, ref: 'Company', required: true },
    moduleKey:  { type: String, required: true },
    endDate:    { type: Date, required: true },
    startDate:  { type: Date, required: true },
    status:     { type: String, required: true },
  },
  { timestamps: true }
);

export const ModuleSubscriptionModel = mongoose.model<IModuleSubscriptionDocument>(
  'ModuleSubscription',
  ModuleSubscriptionSchema
);