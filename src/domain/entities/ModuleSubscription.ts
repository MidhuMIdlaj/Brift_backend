import type { SubscriptionStatus } from "../../shared/enums/registration.enum.js";

export interface IModuleSubscription {
  _id?:      string;
  companyId: string;
  moduleKey: string;
  endDate:   Date;
  startDate: Date;
  status:    SubscriptionStatus;
}