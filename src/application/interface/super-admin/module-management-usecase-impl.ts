import type { GetModuleResponseDTO,AddModuleRequestDTO, AddModuleResponseDTO,EditModuleRequestDTO, 
    EditModuleResponseDTO, DeleteModuleRequestDTO, DeleteModuleResponseDTO
  } from "../../../domain/dtos/user-usecaase/module-management-dto.js";


export interface IModuleManagementUseCases {
  getAllModules(): Promise<GetModuleResponseDTO[]>;
  getModuleById(moduleId: string): Promise<GetModuleResponseDTO>;
  addModule(data: AddModuleRequestDTO): Promise<AddModuleResponseDTO>;
  editModule(data: EditModuleRequestDTO): Promise<EditModuleResponseDTO>;
  deleteModule(data: DeleteModuleRequestDTO): Promise<DeleteModuleResponseDTO>;
}