import type { IModule } from "../../../domain/entities/Module.js";

export interface IModuleValidationService {
  
  validateAndResolve(moduleKeys: string[]): Promise<IModule[]>;

  computePricing(modules: IModule[]): {
    subtotalAmount: number;
    taxAmount:      number;
    totalAmount:    number;
    currency:       string;
  };
}