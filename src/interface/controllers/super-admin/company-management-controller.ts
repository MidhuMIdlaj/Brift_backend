import type{ Request, Response }                  from 'express';
import type { ICompanyManagementUseCases } from '../../../application/interface/super-admin/company-management-usecase-impl.js';
import { AppError } from '../../../domain/error/app-error.js';

export class CompanyManagementController {
  constructor(private readonly companyUseCases: ICompanyManagementUseCases) {}

  // ── GET /api/companies ────────────────────────────────────────────────────
  getAllCompanies = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.companyUseCases.getAllCompanies();
      return res.status(200).json({
        message: 'Companies fetched successfully.',
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to fetch companies.');
    }
  };

  // ── GET /api/companies/:id ────────────────────────────────────────────────
  getCompanyById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message:    'Company ID is required.',
          suggestion: 'Please provide a valid company ID in the URL.',
        });
      }

      const result = await this.companyUseCases.getCompanyById(id);
      return res.status(200).json({
        message: 'Company fetched successfully.',
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to fetch company.');
    }
  };

  // ── PATCH /api/companies/:id/suspend ─────────────────────────────────────
  suspendCompany = async (req: Request, res: Response): Promise<Response> => {
    try {
      console.log("1")
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message:    'Company ID is required.',
          suggestion: 'Please provide a valid company ID in the URL.',
        });
      }

      const result = await this.companyUseCases.suspendCompany({
        companyId: id,
        reason:    req.body.reason,
      });
      console.log("2", result)

      return res.status(200).json({
        message: result.message,
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to suspend company.');
    }
  };

  // ── PATCH /api/companies/:id/activate ────────────────────────────────────
  activateCompany = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message:    'Company ID is required.',
          suggestion: 'Please provide a valid company ID in the URL.',
        });
      }

      const result = await this.companyUseCases.activateCompany({
        companyId: id,
        reason:    req.body.reason,
      });

      return res.status(200).json({
        message: result.message,
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to activate company.');
    }
  };

  // ── DELETE /api/companies/:id ─────────────────────────────────────────────
  deleteCompany = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message:    'Company ID is required.',
          suggestion: 'Please provide a valid company ID in the URL.',
        });
      }

      const result = await this.companyUseCases.deleteCompany({
        companyId: id,
        reason:    req.body.reason,
      });

      return res.status(200).json({
        message: result.message,
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to delete company.');
    }
  };

  private handleError(res: Response, error: unknown, fallback: string): Response {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message:    error.message,
        suggestion: error.suggestion,
      });
    }
    return res.status(500).json({
      message:    fallback,
      suggestion: 'Please try again later or contact support.',
      error:      error instanceof Error ? error.message : 'Unknown error',
    });
  }
}