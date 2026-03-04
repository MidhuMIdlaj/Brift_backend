import type { AddModuleRequestDTO, AddModuleResponseDTO, DeleteModuleRequestDTO, DeleteModuleResponseDTO, EditModuleRequestDTO, EditModuleResponseDTO, GetModuleResponseDTO } from "../../../domain/dtos/user-usecaase/module-management-dto.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../../domain/error/app-error.js";
import type { IModuleManagementRepository } from "../../../domain/repository/super-admin/module-management-repository-impl.js";
import type { IModuleManagementUseCases } from "../../interface/super-admin/module-management-usecase-impl.js";


export class ModuleManagementUseCases implements IModuleManagementUseCases {
  constructor(
    private readonly moduleManagementRepository: IModuleManagementRepository,
  ) {}

  // ─── Get All Modules ──────────────────────────────────────────────────────
  async getAllModules(): Promise<GetModuleResponseDTO[]> {
    const modules = await this.moduleManagementRepository.findAll();
    return modules.map((m) => ({
      _id:           m._id!,
      key:           m.key,
      name:          m.name,
      description:   m.description,
      pricePerMonth: m.pricePerMonth,
      status:        m.status,
      createdAt:     (m as any).createdAt,
    }));
  }

  // ─── Get Module By ID ─────────────────────────────────────────────────────
  async getModuleById(moduleId: string): Promise<GetModuleResponseDTO> {
    const module = await this.moduleManagementRepository.findById(moduleId);
    if (!module) {
      throw new NotFoundError('Module not found.', 'Please check the module ID.');
    }

    return {
      _id:           module._id!,
      key:           module.key,
      name:          module.name,
      description:   module.description,
      pricePerMonth: module.pricePerMonth,
      status:        module.status,
      createdAt:     (module as any).createdAt,
    };
  }

  // ─── Add Module ───────────────────────────────────────────────────────────
  async addModule(data: AddModuleRequestDTO): Promise<AddModuleResponseDTO> {
    // Guard: key must be unique
    const existing = await this.moduleManagementRepository.findByKey(data.key.toUpperCase());
    if (existing) {
      throw new ConflictError(
        `A module with key "${data.key.toUpperCase()}" already exists.`,
        'Please use a different module key.'
      );
    }

    const module = await this.moduleManagementRepository.create({
      key:           data.key.toUpperCase() as any,
      name:          data.name,
      description:   data.description,
      pricePerMonth: data.pricePerMonth,
      status:        data.status ?? 'active',
    });

    return {
      _id:           module._id!,
      key:           module.key,
      name:          module.name,
      description:   module.description,
      pricePerMonth: module.pricePerMonth,
      status:        module.status,
      message:       'Module created successfully.',
    };
  }

  // ─── Edit Module ──────────────────────────────────────────────────────────
  async editModule(data: EditModuleRequestDTO): Promise<EditModuleResponseDTO> {
    const existing = await this.moduleManagementRepository.findById(data.moduleId);
    if (!existing) {
      throw new NotFoundError('Module not found.', 'Please check the module ID.');
    }

    const updateData: Partial<Omit<typeof existing, '_id' | 'key'>> = {};
    if (data.name          !== undefined) updateData.name          = data.name;
    if (data.description   !== undefined) updateData.description   = data.description;
    if (data.pricePerMonth !== undefined) updateData.pricePerMonth = data.pricePerMonth;
    if (data.status        !== undefined) updateData.status        = data.status;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError(
        'No fields provided to update.',
        'Please provide at least one field to update.'
      );
    }

    const updated = await this.moduleManagementRepository.update(data.moduleId, updateData);

    return {
      _id:           updated._id!,
      key:           updated.key,
      name:          updated.name,
      description:   updated.description,
      pricePerMonth: updated.pricePerMonth,
      status:        updated.status,
      message:       'Module updated successfully.',
    };
  }

  // ─── Delete Module ────────────────────────────────────────────────────────
  async deleteModule(data: DeleteModuleRequestDTO): Promise<DeleteModuleResponseDTO> {
    const existing = await this.moduleManagementRepository.findById(data.moduleId);
    if (!existing) {
      throw new NotFoundError('Module not found.', 'Please check the module ID.');
    }

    await this.moduleManagementRepository.delete(data.moduleId);

    return {
      moduleId: data.moduleId,
      message:  'Module deleted successfully.',
    };
  }
}