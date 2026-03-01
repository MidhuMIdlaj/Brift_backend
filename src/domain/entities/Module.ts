import type { ModuleKey } from "../../shared/enums/registration.enum.js";

export interface IModule {
  _id?:          string;
  key:           ModuleKey;
  name:          string;
  description:   string;
  status:        'active' | 'inactive';
  pricePerMonth: number;
}