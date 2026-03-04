import type { DeleteCompanyRequestDTO, DeleteCompanyResponseDTO, GetCompanyResponseDTO, ListCompaniesResponseDTO, SuspendCompanyRequestDTO, SuspendCompanyResponseDTO } from "../../../domain/dtos/user-usecaase/company-management-dto.js";
import { BadRequestError, NotFoundError } from "../../../domain/error/app-error.js";
import type { ICompanyManagementRepository } from "../../../domain/repository/super-admin/company-management-repository-impl.js";
import type { ICompanyManagementUseCases } from "../../interface/super-admin/company-management-usecase-impl.js";


export class CompanyManagementUseCases implements ICompanyManagementUseCases {
  constructor(
    private readonly companyManagementRepository: ICompanyManagementRepository,
  ) {}

  // ─── Get All Companies ────────────────────────────────────────────────────
  async getAllCompanies(): Promise<ListCompaniesResponseDTO> {
    const companies = await this.companyManagementRepository.findAll();

    const mapped: GetCompanyResponseDTO[] = companies.map((c) => ({
      _id:          c._id!,
      name:         c.name,
      isActive:     c.isActive,
      isDeleted:    (c as any).isDeleted ?? false,
      companySize:  c.companySize,
      industryType: c.industryType,
      address:      c.address,
      contact:      c.contact,
      legal:        c.legal,
      branding:     c.branding,
      createdAt:    c.createdAt,
    }));

    return { companies: mapped, total: mapped.length };
  }

  // ─── Get Company By ID ────────────────────────────────────────────────────
  async getCompanyById(companyId: string): Promise<GetCompanyResponseDTO> {
    const company = await this.companyManagementRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError(
        'Company not found.',
        'Please check the company ID and try again.'
      );
    }

    return {
      _id:          company._id!,
      name:         company.name,
      isActive:     company.isActive,
      isDeleted:    (company as any).isDeleted ?? false,
      companySize:  company.companySize,
      industryType: company.industryType,
      address:      company.address,
      contact:      company.contact,
      legal:        company.legal,
      branding:     company.branding,
      createdAt:    company.createdAt,
    };
  }

  // ─── Suspend Company ──────────────────────────────────────────────────────
  async suspendCompany(data: SuspendCompanyRequestDTO): Promise<SuspendCompanyResponseDTO> {
    const company = await this.companyManagementRepository.findById(data.companyId);
    if (!company) {
      throw new NotFoundError('Company not found.', 'Please check the company ID.');
    }

    if (!company.isActive) {
      throw new BadRequestError(
        'Company is already suspended.',
        'This company is already inactive.'
      );
    }

    if ((company as any).isDeleted) {
      throw new BadRequestError(
        'Cannot suspend a deleted company.',
        'This company has been deleted.'
      );
    }

    const updated = await this.companyManagementRepository.suspend(data.companyId);

    return {
      companyId: updated._id!,
      isActive:  updated.isActive,
      message:   'Company suspended successfully.',
    };
  }

  // ─── Activate Company ─────────────────────────────────────────────────────
  async activateCompany(data: SuspendCompanyRequestDTO): Promise<SuspendCompanyResponseDTO> {
    const company = await this.companyManagementRepository.findById(data.companyId);
    if (!company) {
      throw new NotFoundError('Company not found.', 'Please check the company ID.');
    }

    if (company.isActive) {
      throw new BadRequestError(
        'Company is already active.',
        'This company is already active.'
      );
    }

    if ((company as any).isDeleted) {
      throw new BadRequestError(
        'Cannot activate a deleted company.',
        'This company has been deleted.'
      );
    }

    const updated = await this.companyManagementRepository.activate(data.companyId);

    return {
      companyId: updated._id!,
      isActive:  updated.isActive,
      message:   'Company activated successfully.',
    };
  }

  // ─── Soft Delete Company ──────────────────────────────────────────────────
  async deleteCompany(data: DeleteCompanyRequestDTO): Promise<DeleteCompanyResponseDTO> {
    const company = await this.companyManagementRepository.findById(data.companyId);
    if (!company) {
      throw new NotFoundError('Company not found.', 'Please check the company ID.');
    }

    if ((company as any).isDeleted) {
      throw new BadRequestError(
        'Company is already deleted.',
        'This company has already been soft deleted.'
      );
    }

    const updated = await this.companyManagementRepository.softDelete(data.companyId);

    return {
      companyId: updated._id!,
      isDeleted: (updated as any).isDeleted,
      deletedAt: (updated as any).deletedAt,
      message:   'Company deleted successfully.',
    };
  }
}