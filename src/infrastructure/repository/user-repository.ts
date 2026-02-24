import type { IUser } from "../../domain/entities/User.js";
import type { IUserRepository } from "../../domain/repository/user-repository-impl.js";
import { UserModel } from "../db/model/user-model.js";


export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (!user) return null;
    return { ...user, _id: user._id.toString() };
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id).lean();
    if (!user) return null;
    return { ...user, _id: user._id.toString() };
  }

  async updateOtp(email: string, otp: string, otpExpiresAt: Date): Promise<void> {
    await UserModel.updateOne(
      { email: email.toLowerCase() },
      { $set: { otp, otpExpiresAt } }
    );
  }

  async clearOtp(email: string): Promise<void> {
    await UserModel.updateOne(
      { email: email.toLowerCase() },
      { $set: { otp: null, otpExpiresAt: null } }
    );
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await UserModel.updateOne(
      { email: email.toLowerCase() },
      { $set: { password: hashedPassword } }
    );
  }

  async verifyEmail(email: string): Promise<void> {
    await UserModel.updateOne(
      { email: email.toLowerCase() },
      { $set: { isEmailVerified: true } }
    );
  }

  async updateRefreshToken(userId: string, hashedToken: string | null): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { refreshToken: hashedToken } }
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { lastLoginAt: new Date() } }
    );
  }
}