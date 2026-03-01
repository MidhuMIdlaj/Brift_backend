import type { IModuleValidationService } from "../../application/interface/register-company/module-validation-service-impl.js";
import type { IModule } from "../../domain/entities/Module.js";
import { BadRequestError } from "../../domain/error/app-error.js";
import type { IModuleRepository } from "../../domain/repository/registration-repository-impl.js";


const TAX_RATE = 0.18; 

export class ModuleValidationService implements IModuleValidationService {
  constructor(private readonly moduleRepository: IModuleRepository) {}

  async validateAndResolve(moduleKeys: string[]): Promise<IModule[]> {
    if (!moduleKeys || moduleKeys.length === 0) {
      throw new BadRequestError(
        'No modules selected.',
        'Please select at least one module from the pricing page.'
      );
    }

    const modules = await this.moduleRepository.findByKeys(moduleKeys);
    
    if (modules.length !== moduleKeys.length) {
      const foundKeys  = modules.map((m) => m.key as string);
      const missing    = moduleKeys.filter((k) => !foundKeys.includes(k));
      throw new BadRequestError(
        `Invalid or inactive module key(s): ${missing.join(', ')}.`,
        'Please refresh the page and select valid modules.'
      );
    }

    return modules;
  }

  /**
   * Computes subtotal, tax (18% GST), and total for a set of modules.
   */
  computePricing(modules: IModule[]): {
    subtotalAmount: number;
    taxAmount:      number;
    totalAmount:    number;
    currency:       string;
  } {
    const subtotalAmount = modules.reduce((sum, m) => sum + m.pricePerMonth, 0);
    const taxAmount      = Math.round(subtotalAmount * TAX_RATE * 100) / 100;
    const totalAmount    = Math.round((subtotalAmount + taxAmount) * 100) / 100;

    return { subtotalAmount, taxAmount, totalAmount, currency: 'INR' };
  }
}