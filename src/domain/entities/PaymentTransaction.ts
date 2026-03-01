import type { PaymentStatus, PaymentType } from "../../shared/enums/registration.enum.js";

export interface IPaymentTransaction {
  _id?:               string;
  companyId:          string;
  totalAmount:        number;
  paymentStatus:      PaymentStatus;
  subtotalAmount:     number;
  taxAmount:          number;
  currency:           string;
  paymentMethod?:     string;
  receiptUrl?:        string;
  paidAt?:            Date;
  paymentType:        PaymentType;
  gateway?:           string;
  gatewayOrderId?:    string;
  gatewayPaymentId?:  string;
  purchasedModules?:  string[];
  billingCycleMonths: number;
  createdAt?:         Date;
  updatedAt?:         Date;
}