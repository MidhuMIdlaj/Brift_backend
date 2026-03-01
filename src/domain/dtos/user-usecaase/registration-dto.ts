import type { PaymentProvider } from "../../../shared/enums/registration.enum.js";
import type { ICompanyAddress, ICompanyBranding, ICompanyContact, ICompanyLegal } from "../../entities/Company.js";


export interface GetModulesResponseDTO {
  _id:           string;
  key:           string;
  name:          string;
  description:   string;
  pricePerMonth: number;
}


export interface RegisterCompanyRequestDTO {
  // ── Company fields ──────────────────────────────────────────────────────────
  name:               string;
  address:            ICompanyAddress;
  contact:            ICompanyContact;
  companySize:        string;
  legal:              ICompanyLegal;
  branding?:          ICompanyBranding;
  industryType:       'Residential' | 'Commercial' | 'Infrastructure' | 'Industrial' | 'Mixed';
  selectedModuleKeys: string[];       // chosen on the landing/pricing page

  // ── Admin (company head) fields ──────────────────────────────────────────────
  admin: {
    firstName:  string;
    lastName:   string;
    email:      string;
    password:   string;
    phone?:     string;
  };
}

export interface RegisterCompanyResponseDTO {
  // Company info
  companyId:   string;
  companyName: string;

  // Admin info
  adminId:    string;
  adminEmail: string;

  selectedModules: {
    key:           string;
    name:          string;
    pricePerMonth: number;
  }[];
  subtotalAmount: number;
  taxAmount:      number;
  totalAmount:    number;
  currency:       string;

  message: string;
}


export interface InitiatePaymentRequestDTO {
  companyId:          string;
  selectedModuleKeys: string[];
  currency?:          string;
}

export interface InitiatePaymentResponseDTO {
  transactionId:  string;
  clientSecret?:  string;
}


export interface VerifyPaymentRequestDTO {
  transactionId: string;
  paymentIntentId?:   string;
}

export interface VerifyPaymentResponseDTO {
  message:            string;
  transactionId:      string;
  paymentStatus:      string;
  subscriptionStatus: string;
  activatedModules:   string[];
  startDate:          Date;
  endDate:            Date;
}