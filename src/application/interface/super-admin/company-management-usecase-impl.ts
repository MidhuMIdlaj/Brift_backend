import type { DeleteCompanyRequestDTO,
DeleteCompanyResponseDTO, 
GetCompanyResponseDTO, 
ListCompaniesResponseDTO, 
SuspendCompanyRequestDTO, 
SuspendCompanyResponseDTO } from "../../../domain/dtos/user-usecaase/company-management-dto.js";


export interface ICompanyManagementUseCases {
  getAllCompanies(): Promise<ListCompaniesResponseDTO>;
  getCompanyById(companyId: string): Promise<GetCompanyResponseDTO>;
  suspendCompany(data: SuspendCompanyRequestDTO): Promise<SuspendCompanyResponseDTO>;
  activateCompany(data: SuspendCompanyRequestDTO): Promise<SuspendCompanyResponseDTO>;
  deleteCompany(data: DeleteCompanyRequestDTO): Promise<DeleteCompanyResponseDTO>;
}