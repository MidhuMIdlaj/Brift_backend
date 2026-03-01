import type { GetModulesResponseDTO, InitiatePaymentRequestDTO, InitiatePaymentResponseDTO, RegisterCompanyRequestDTO, RegisterCompanyResponseDTO, VerifyPaymentRequestDTO, VerifyPaymentResponseDTO } from "../../../domain/dtos/user-usecaase/registration-dto.js";



export interface IRegistrationUseCases {
  getAvailableModules(): Promise<GetModulesResponseDTO[]>;

  registerCompany(data: RegisterCompanyRequestDTO): Promise<RegisterCompanyResponseDTO>;

  initiatePayment(data: InitiatePaymentRequestDTO): Promise<InitiatePaymentResponseDTO>;

  verifyAndActivate(data: VerifyPaymentRequestDTO): Promise<VerifyPaymentResponseDTO>;
}