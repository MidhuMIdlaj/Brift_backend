import type { ICompany } from "../entities/Company.js";
import type { IModule } from "../entities/Module.js";
import type { IModuleSubscription } from "../entities/ModuleSubscription.js";
import type { IPaymentTransaction } from "../entities/PaymentTransaction.js";
import type { ISubscriptionHistory } from "../entities/SubscriptionHistory.js";


// ─── Module ───────────────────────────────────────────────────────────────────
export interface IModuleRepository {
  findAll(): Promise<IModule[]>;
  findByKeys(keys: string[]): Promise<IModule[]>;
  findByKey(key: string): Promise<IModule | null>;
}

// ─── Company ──────────────────────────────────────────────────────────────────
export interface ICompanyRepository {
  create(data: Omit<ICompany, '_id'>): Promise<ICompany>;
  findById(id: string): Promise<ICompany | null>;
  findByEmail(email: string): Promise<ICompany | null>;
  findByGSTIN(gstin: string): Promise<ICompany | null>;
  updateIsActive(id: string, isActive: boolean): Promise<void>;
}

// ─── Role ─────────────────────────────────────────────────────────────────────
export interface IRoleRepository {
  findByName(name: string): Promise<{ _id: string; name: string } | null>;
  findById(id: string): Promise<{ _id: string; name: string } | null>;
  findOrCreate(name: string, description: string, isSystemRole: boolean): Promise<{ _id: string; name: string }>;
}

// ─── PaymentTransaction ───────────────────────────────────────────────────────
export interface IPaymentTransactionRepository {
  create(data: Omit<IPaymentTransaction, '_id'>): Promise<IPaymentTransaction>;
  findById(id: string): Promise<IPaymentTransaction | null>;
  updateStatus(
    id: string,
    status: string,
    providerPaymentId?: string,
    providerSignature?: string,
    receiptUrl?: string,
    paidAt?: Date
  ): Promise<void>;
  findByProviderOrderId(orderId: string): Promise<IPaymentTransaction | null>;
}

// ─── ModuleSubscription ───────────────────────────────────────────────────────
export interface IModuleSubscriptionRepository {
  createMany(data: Omit<IModuleSubscription, '_id'>[]): Promise<IModuleSubscription[]>;
  findByCompanyId(companyId: string): Promise<IModuleSubscription[]>;
}

// ─── SubscriptionHistory ──────────────────────────────────────────────────────
export interface ISubscriptionHistoryRepository {
  create(data: Omit<ISubscriptionHistory, '_id'>): Promise<ISubscriptionHistory>;
  findByCompanyId(companyId: string): Promise<ISubscriptionHistory[]>;
}