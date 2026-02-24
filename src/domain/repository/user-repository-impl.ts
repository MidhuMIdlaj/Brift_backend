import type { IUser } from "../entities/User.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  updateOtp(email: string, otp: string, otpExpiresAt: Date): Promise<void>;
  clearOtp(email: string): Promise<void>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  verifyEmail(email: string): Promise<void>;
  updateRefreshToken(userId: string, hashedToken: string | null): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;
}