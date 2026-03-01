import type { Request, Response }        from 'express';
import type { IRegistrationUseCases } from '../../application/interface/register-company/registration-usecase-impl.js';
import { AppError } from '../../domain/error/app-error.js';
import { PaymentProvider } from '../../shared/enums/registration.enum.js';

export class RegistrationController {
  constructor(private readonly registrationUseCases: IRegistrationUseCases) {}

  // ── GET /api/registration/modules ──────────────────────────────────────────
  getModules = async (req: Request, res: Response): Promise<Response> => {
    try {
      const modules = await this.registrationUseCases.getAvailableModules();
      return res.status(200).json({
        message: 'Modules fetched successfully.',
        data:    modules,
      });
    } catch (error) {
      return this.handleError(res, error, 'An error occurred while fetching modules.');
    }
  };

  // ── POST /api/registration/company ─────────────────────────────────────────
  // Registers company + admin in a single call.
  // Module validation is handled internally by ModuleValidationService.
  registerCompany = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        name, address, contact, companySize, legal, branding,
        industryType, selectedModuleKeys, admin,
      } = req.body;

      // ── Field-level validation ────────────────────────────────────────────
      if (!name || !address || !contact || !companySize || !legal || !industryType || !selectedModuleKeys) {
        return res.status(400).json({
          message:    'Registration failed: Missing company fields.',
          suggestion: 'Please provide name, address, contact, companySize, legal, industryType, and selectedModuleKeys.',
        });
      }

      if (!Array.isArray(selectedModuleKeys) || selectedModuleKeys.length === 0) {
        return res.status(400).json({
          message:    'Registration failed: No modules selected.',
          suggestion: 'Please select at least one module from the pricing page.',
        });
      }

      if (!admin || !admin.firstName || !admin.lastName || !admin.email || !admin.password) {
        return res.status(400).json({
          message:    'Registration failed: Missing admin fields.',
          suggestion: 'Please provide admin.firstName, admin.lastName, admin.email, and admin.password.',
        });
      }

      if (admin.password.length < 8) {
        return res.status(400).json({
          message:    'Registration failed: Admin password too short.',
          suggestion: 'Password must be at least 8 characters long.',
        });
      }

      const result = await this.registrationUseCases.registerCompany(req.body);
      return res.status(201).json({
        message: result.message,
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'An error occurred during company registration.');
    }
  };

  // ── POST /api/registration/payment/initiate ────────────────────────────────
 initiatePayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { companyId, selectedModuleKeys, currency } = req.body;

    if (!companyId || !selectedModuleKeys) {
      return res.status(400).json({
        message:    'Payment initiation failed: Missing required fields.',
        suggestion: 'Please provide companyId and selectedModuleKeys.',
      });
    }

    if (!Array.isArray(selectedModuleKeys) || selectedModuleKeys.length === 0) {
      return res.status(400).json({
        message:    'Payment initiation failed: No modules selected.',
        suggestion: 'Please provide at least one module key.',
      });
    }

    const result = await this.registrationUseCases.initiatePayment({
      companyId, selectedModuleKeys, currency,
    });

    return res.status(200).json({
      message: 'Payment order created successfully.',
      data:    result,
    });
  } catch (error) {
    return this.handleError(res, error, 'An error occurred while initiating the payment.');
  }
};

verifyPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { transactionId, paymentIntentId } = req.body;

    if (!transactionId || !paymentIntentId) {
      return res.status(400).json({
        message:    'Payment verification failed: Missing required fields.',
        suggestion: 'Please provide transactionId and paymentIntentId.',
      });
    }

    const result = await this.registrationUseCases.verifyAndActivate({
      transactionId,
      paymentIntentId,
    });

    return res.status(200).json({
      message: result.message,
      data:    result,
    });
  } catch (error) {
    return this.handleError(res, error, 'An error occurred while verifying the payment.');
  }
};

  // ── Shared error handler ───────────────────────────────────────────────────
  private handleError(res: Response, error: unknown, fallbackMessage: string): Response {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message:    error.message,
        suggestion: error.suggestion,
      });
    }
    return res.status(500).json({
      message:    fallbackMessage,
      suggestion: 'Please try again later or contact support.',
      error:      error instanceof Error ? error.message : 'Unknown error',
    });
  }
}