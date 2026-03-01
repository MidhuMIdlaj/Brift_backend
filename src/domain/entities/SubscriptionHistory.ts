
export interface ISubscriptionHistory {
  _id?:             string;
  purchasedModules: string[];
  companyId:        string;
  transactionId:    string;
  price:            string;
  startDate:        Date;
  endDate:          Date;
}