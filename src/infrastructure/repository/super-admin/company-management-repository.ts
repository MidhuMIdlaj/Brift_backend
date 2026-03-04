import type { ICompany } from "../../../domain/entities/Company.js";
import type { ICompanyManagementRepository } from "../../../domain/repository/super-admin/company-management-repository-impl.js";
import { CompanyModel } from "../../db/model/company-model.js";


export class CompanyManagementRepository implements ICompanyManagementRepository {

  async findAll(includeDeleted = false): Promise<ICompany[]> {
    const filter = includeDeleted ? {} : { isDeleted: { $ne: true } };
    const docs = await CompanyModel.find(filter).lean<ICompany[]>();
    return docs.map((d) => ({ ...d, _id: d._id!.toString() }));
  }

  async findById(id: string): Promise<ICompany | null> {
    const doc = await CompanyModel.findById(id).lean<ICompany>();
    if (!doc) return null;
    return { ...doc, _id: doc._id!.toString() };
  }

  // isActive: false → suspended
  async suspend(id: string): Promise<ICompany> {
    const doc = await CompanyModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).lean<ICompany>();
    return { ...doc!, _id: doc!._id!.toString() };
  }

  // isActive: true → back to active
  async activate(id: string): Promise<ICompany> {
    const doc = await CompanyModel.findByIdAndUpdate(
      id,
      { $set: { isActive: true } },
      { new: true }
    ).lean<ICompany>();
    return { ...doc!, _id: doc!._id!.toString() };
  }

  // Soft delete — never removes from DB
  async softDelete(id: string): Promise<ICompany> {
    const doc = await CompanyModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, isActive: false, deletedAt: new Date() } },
      { new: true }
    ).lean<ICompany>();
    return { ...doc!, _id: doc!._id!.toString() };
  }
}