import { AuthUseCases } from "../../application/usecase/common/auth-usecase.js";
import { RegistrationUseCases } from "../../application/usecase/register-company/registration-company-usecases.js";
import { AuthController } from "../../interface/controllers/auth-controller.js";
import { RegistrationController } from "../../interface/controllers/registration-company-controller.js";
import { CompanyRepository, ModuleRepository, ModuleSubscriptionRepository, PaymentTransactionRepository, RoleRepository, SubscriptionHistoryRepository } from "../repository/company-register-repository.js";
import { UserRepository } from "../repository/user-repository.js";
import { EmailService } from "../services/email-service.js";
import { JwtService } from "../services/jwt-service.js";
import { ModuleValidationService } from "../services/module-validation-service.js";
import { PaymentService } from "../services/payment-service.js";


// ─── Repositories ─────────────────────────────────────────────────────────────
const userRepository                = new UserRepository();
const moduleRepository              = new ModuleRepository();
const companyRepository             = new CompanyRepository();
const roleRepository                = new RoleRepository();
const paymentTransactionRepository  = new PaymentTransactionRepository();
const moduleSubscriptionRepository  = new ModuleSubscriptionRepository();
const subscriptionHistoryRepository = new SubscriptionHistoryRepository();

// ─── Services ─────────────────────────────────────────────────────────────────
const jwtService     = new JwtService();
const emailService   = new EmailService();
const paymentService = new PaymentService();

/**
 * ModuleValidationService — internal service, NOT wired to any HTTP route.
 * Injected directly into RegistrationUseCases so module validation
 * happens at the application layer with no public API endpoint.
 */
const moduleValidationService = new ModuleValidationService(moduleRepository);

// ─── Use Cases ────────────────────────────────────────────────────────────────
const authUseCases = new AuthUseCases(userRepository, jwtService, emailService);

const registrationUseCases = new RegistrationUseCases(
  moduleRepository,
  companyRepository,
  roleRepository,
  userRepository,
  paymentTransactionRepository,
  moduleSubscriptionRepository,
  subscriptionHistoryRepository,
  paymentService,
  emailService,
  moduleValidationService,   // ← injected here
);

// ─── Controllers ──────────────────────────────────────────────────────────────
export const authController         = new AuthController(authUseCases);
export const registrationController = new RegistrationController(registrationUseCases);