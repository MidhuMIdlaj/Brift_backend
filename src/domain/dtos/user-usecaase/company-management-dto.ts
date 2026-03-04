import type { ICompanyAddress, ICompanyBranding, ICompanyContact, ICompanyLegal } from "../../entities/Company.js";

// ─── Suspend / Unsuspend ──────────────────────────────────────────────────────
export interface SuspendCompanyRequestDTO {
  companyId: string;
  reason?:   string;
}

export interface SuspendCompanyResponseDTO {
  companyId: string;
  isActive:  boolean;
  message:   string;
}

// ─── Soft Delete ──────────────────────────────────────────────────────────────
export interface DeleteCompanyRequestDTO {
  companyId: string;
  reason?:   string;
}

export interface DeleteCompanyResponseDTO {
  companyId:  string;
  isDeleted:  boolean;
  deletedAt:  Date;
  message:    string;
}

// ─── Get Company ──────────────────────────────────────────────────────────────
export interface GetCompanyResponseDTO {
  _id:          string;
  name:         string;
  isActive:     boolean;
  isDeleted:    boolean;
  companySize:  string | undefined;
  industryType: string;
  address:      ICompanyAddress;
  contact:      ICompanyContact;
  legal:        ICompanyLegal;
  branding?:    ICompanyBranding;
  createdAt?:   Date;
}

// ─── List Companies ───────────────────────────────────────────────────────────
export interface ListCompaniesResponseDTO {
  companies: GetCompanyResponseDTO[];
  total:     number;
}