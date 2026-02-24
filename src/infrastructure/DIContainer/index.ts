import { AuthUseCases } from "../../application/usecase/common/auth-usecase.js";
import { AuthController } from "../../interface/controllers/auth-controller.js";
import { UserRepository } from "../repository/user-repository.js";
import { EmailService } from "../services/email-service.js";
import { JwtService } from "../services/jwt-service.js";


// ─── Repositories ─────────────────────────────────────────────────────────────
const userRepository = new UserRepository();

// ─── Services ─────────────────────────────────────────────────────────────────
const jwtService   = new JwtService();
const emailService = new EmailService();

// ─── Use Cases ────────────────────────────────────────────────────────────────
const authUseCases = new AuthUseCases(userRepository, jwtService, emailService);

// ─── Controllers ──────────────────────────────────────────────────────────────
export const authController = new AuthController(authUseCases);