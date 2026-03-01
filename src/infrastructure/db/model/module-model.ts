import mongoose, { Schema } from "mongoose";
import type { IModule } from "../../../domain/entities/Module.js";

export interface IModuleDocument extends Omit<IModule, '_id'>, Document {}

const ModuleSchema = new Schema<IModuleDocument>(
  {
    key:           { type: String, required: true, unique: true },
    name:          { type: String, required: true },
    description:   { type: String, required: true },
    status:        { type: String, enum: ['active', 'inactive'], default: 'active' },
    pricePerMonth: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ModuleModel = mongoose.model<IModuleDocument>('Module', ModuleSchema);