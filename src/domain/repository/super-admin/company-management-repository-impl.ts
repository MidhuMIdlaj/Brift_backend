import type { ICompany } from "../../entities/Company.js";

export interface ICompanyManagementRepository {
  findById(id: string): Promise<ICompany | null>;
  findAll(includeDeleted?: boolean): Promise<ICompany[]>;
  suspend(id: string): Promise<ICompany>;
  activate(id: string): Promise<ICompany>;
  softDelete(id: string): Promise<ICompany>;
}