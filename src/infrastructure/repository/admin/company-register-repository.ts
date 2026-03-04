import type { ICompany } from "../../../domain/entities/Company.js";
import type { IModule } from "../../../domain/entities/Module.js";
import type { IModuleSubscription } from "../../../domain/entities/ModuleSubscription.js";
import type { IPaymentTransaction } from "../../../domain/entities/PaymentTransaction.js";
import type { ISubscriptionHistory } from "../../../domain/entities/SubscriptionHistory.js";
import type { ICompanyRepository, IModuleRepository, IModuleSubscriptionRepository, IPaymentTransactionRepository, IRoleRepository, ISubscriptionHistoryRepository } from "../../../domain/repository/admin/registration-repository-impl.js";
import { CompanyModel } from "../../db/model/company-model.js";
import { ModuleModel } from "../../db/model/module-model.js";
import { ModuleSubscriptionModel } from "../../db/model/module-subscription-model.js";
import { PaymentTransactionModel } from "../../db/model/payment-transaction-model.js";
import { RoleModel } from "../../db/model/role-model.js";
import { SubscriptionHistoryModel } from "../../db/model/subscription-history-model.js";


// ─── Module ───────────────────────────────────────────────────────────────────
export class ModuleRepository implements IModuleRepository {
  async findAll(): Promise<IModule[]> {
    const docs = await ModuleModel.find({ status: 'active' }).lean<IModule[]>();
    return docs.map((d) => ({ ...d, _id: d._id!.toString() }));
  }
  async findByKeys(keys: string[]): Promise<IModule[]> {
    const upperKeys = keys.map((k) => k.toUpperCase());
    const docs = await ModuleModel.find({ key: { $in: upperKeys }, status: 'active' }).lean<IModule[]>();
    return docs.map((d) => ({ ...d, _id: d._id!.toString() }));
  }
  
  async findByKey(key: string): Promise<IModule | null> {
    const doc = await ModuleModel.findOne({ key: key.toUpperCase()}).lean<IModule>();
    if (!doc) return null;
    return { ...doc, _id: doc._id!.toString() };
  }
}

// ─── Company ──────────────────────────────────────────────────────────────────
export class CompanyRepository implements ICompanyRepository {
  async create(data: Omit<ICompany, '_id'>): Promise<ICompany> {
  try {
    const doc = await CompanyModel.create(data);
    return { ...(doc.toObject() as unknown as ICompany), _id: doc._id.toString() };
  } catch (err: any) {
    console.error('CompanyModel.create failed:', err.message);
    console.error('Validation errors:', err.errors);
    throw err;
  }
 }
  async findById(id: string): Promise<ICompany | null> {
    const doc = await CompanyModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() };
  }
  async findByEmail(email: string): Promise<ICompany | null> {
    const doc = await CompanyModel.findOne({ 'contact.email': email.toLowerCase() }).lean();
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() };
  }
  async findByGSTIN(gstin: string): Promise<ICompany | null> {
    const doc = await CompanyModel.findOne({ 'legal.GSTIN': gstin }).lean();
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() };
  }
  async updateIsActive(id: string, isActive: boolean): Promise<void> {
    await CompanyModel.updateOne({ _id: id }, { $set: { isActive } });
  }
}


// ─── Role ─────────────────────────────────────────────────────────────────────
export class RoleRepository implements IRoleRepository {
  async findByName(name: string): Promise<{ _id: string; name: string } | null> {
    const doc = await RoleModel.findOne({ name }).lean<{ _id: any; name: string }>();
    if (!doc) return null;
    return { _id: doc._id.toString(), name: doc.name };
  }
  async findById(id: string): Promise<{ _id: string; name: string } | null> {
    const doc = await RoleModel.findById(id).lean<{ _id: any; name: string }>();
    if (!doc) return null;
    return { _id: doc._id.toString(), name: doc.name };
  }
  async findOrCreate(
    name:         string,
    description:  string,
    isSystemRole: boolean
  ): Promise<{ _id: string; name: string }> {
    const existing = await RoleModel.findOne({ name }).lean<{ _id: any; name: string }>();
    if (existing) {
      return { _id: existing._id.toString(), name: existing.name };
    }

    const created = await RoleModel.create({ name, description, isSystemRole });
    return { _id: created._id.toString(), name: created.name };
  }
}

// ─── PaymentTransaction ───────────────────────────────────────────────────────
export class PaymentTransactionRepository implements IPaymentTransactionRepository {
  async create(data: Omit<IPaymentTransaction, '_id'>): Promise<IPaymentTransaction> {
  console.log('data:', data);
  try {
    const doc = await PaymentTransactionModel.create(data);
    console.log('2 - created:', doc);
    return { ...(doc.toObject() as unknown as IPaymentTransaction), _id: doc._id.toString() };
  } catch (err: any) {
    console.error('PaymentTransactionModel.create failed:', err.message);
    console.error('Validation errors:', err.errors);
    throw err;
  }
  }
  async findById(id: string): Promise<IPaymentTransaction | null> {
    const doc = await PaymentTransactionModel.findById(id).lean<IPaymentTransaction>();
    if (!doc) return null;
    return { ...doc, _id: doc._id!.toString() };
  }
  async findByProviderOrderId(orderId: string): Promise<IPaymentTransaction | null> {
    const doc = await PaymentTransactionModel.findOne({ providerOrderId: orderId }).lean<IPaymentTransaction>();
    if (!doc) return null;
    return { ...doc, _id: doc._id!.toString() };
  }
  async updateStatus(
    id: string,
    status: string,
    providerPaymentId?: string,
    providerSignature?: string,
    receiptUrl?: string,
    paidAt?: Date
  ): Promise<void> {
    await PaymentTransactionModel.updateOne(
      { _id: id },
      {
        $set: {
          paymentStatus: status,
          ...(providerPaymentId && { providerPaymentId }),
          ...(providerSignature && { providerSignature }),
          ...(receiptUrl        && { receiptUrl }),
          ...(paidAt            && { paidAt }),
        },
      }
    );
  }
}


// ─── ModuleSubscription ───────────────────────────────────────────────────────
export class ModuleSubscriptionRepository implements IModuleSubscriptionRepository {
  async createMany(data: Omit<IModuleSubscription, '_id'>[]): Promise<IModuleSubscription[]> {
    const docs = await ModuleSubscriptionModel.insertMany(data);
    return docs.map((d) => ({ ...d.toObject(), _id: d._id.toString() }));
  }
  async findByCompanyId(companyId: string): Promise<IModuleSubscription[]> {
    const docs = await ModuleSubscriptionModel.find({ companyId }).lean<IModuleSubscription[]>();
    return docs.map((d) => ({ ...d, _id: d._id!.toString() }));
  }
}

// ─── SubscriptionHistory ──────────────────────────────────────────────────────
export class SubscriptionHistoryRepository implements ISubscriptionHistoryRepository {
  async create(data: Omit<ISubscriptionHistory, '_id'>): Promise<ISubscriptionHistory> {
    const doc = await SubscriptionHistoryModel.create(data);
    return { ...(doc.toObject() as unknown as ISubscriptionHistory), _id: doc._id.toString() };
  }
  async findByCompanyId(companyId: string): Promise<ISubscriptionHistory[]> {
    const docs = await SubscriptionHistoryModel.find({ companyId }).lean<ISubscriptionHistory[]>();
    return docs.map((d) => ({ ...d, _id: d._id!.toString() }));
  }
}