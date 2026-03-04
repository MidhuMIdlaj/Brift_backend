import type{ Request, Response }              from 'express';
import type { IModuleManagementUseCases } from '../../../application/interface/super-admin/module-management-usecase-impl.js';
import { AppError } from '../../../domain/error/app-error.js';


export class ModuleManagementController {
  constructor(private readonly moduleUseCases: IModuleManagementUseCases) {}

  // ── GET /api/modules ──────────────────────────────────────────────────────
  getAllModules = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.moduleUseCases.getAllModules();
      return res.status(200).json({
        message: 'Modules fetched successfully.',
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to fetch modules.');
    }
  };

  // ── GET /api/modules/:id ──────────────────────────────────────────────────
  getModuleById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message:    'Module ID is required.',
          suggestion: 'Please provide a valid module ID in the URL.',
        });
      }

      const result = await this.moduleUseCases.getModuleById(id);
      return res.status(200).json({
        message: 'Module fetched successfully.',
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to fetch module.');
    }
  };

  // ── POST /api/modules ─────────────────────────────────────────────────────
  addModule = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { key, name, description, pricePerMonth, status } = req.body;

      if (!key || !name || !description || pricePerMonth === undefined) {
        return res.status(400).json({
          message:    'Module creation failed: Missing required fields.',
          suggestion: 'Please provide key, name, description, and pricePerMonth.',
        });
      }

      if (typeof pricePerMonth !== 'number' || pricePerMonth < 0) {
        return res.status(400).json({
          message:    'Module creation failed: Invalid price.',
          suggestion: 'pricePerMonth must be a positive number.',
        });
      }

      const result = await this.moduleUseCases.addModule({
        key, name, description, pricePerMonth, status,
      });

      return res.status(201).json({
        message: result.message,
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to create module.');
    }
  };

  // ── PATCH /api/modules/:id ────────────────────────────────────────────────
  editModule = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message:    'Module ID is required.',
          suggestion: 'Please provide a valid module ID in the URL.',
        });
      }

      const { name, description, pricePerMonth, status } = req.body;

      if (!name && !description && pricePerMonth === undefined && !status) {
        return res.status(400).json({
          message:    'Module update failed: No fields provided.',
          suggestion: 'Please provide at least one field to update.',
        });
      }

      const result = await this.moduleUseCases.editModule({
        moduleId: id, name, description, pricePerMonth, status,
      });

      return res.status(200).json({
        message: result.message,
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to update module.');
    }
  };

  // ── DELETE /api/modules/:id ───────────────────────────────────────────────
  deleteModule = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message:    'Module ID is required.',
          suggestion: 'Please provide a valid module ID in the URL.',
        });
      }

      const result = await this.moduleUseCases.deleteModule({ moduleId: id });

      return res.status(200).json({
        message: result.message,
        data:    result,
      });
    } catch (error) {
      return this.handleError(res, error, 'Failed to delete module.');
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