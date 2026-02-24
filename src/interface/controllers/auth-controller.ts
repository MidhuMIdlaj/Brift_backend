import type { Request } from 'express';
import type { Response } from 'express';
import type { IAuthUseCases }    from '../../application/interface/common/auth-usecase.impl.js';
import { AppError }         from '../../domain/error/app-error.js';
import { OtpPurpose }       from '../../shared/enums/OtpPurpose.enum.js';

export class AuthController {
  constructor(private readonly authUseCases: IAuthUseCases) {}

  // ─── POST /auth/login ──────────────────────────────────────────────────────
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:    'Login failed: Missing required fields.',
          suggestion: 'Please provide both email and password.',
        });
      }

      const result = await this.authUseCases.login({ email, password });

      return res.status(200).json({
        message: 'Login successful.',
        data:    result,
      });
    } catch (error) {
      console.log('Error in login controller:', error);
      return this.handleError(res, error, 'An error occurred during login.');
    }
  };

  // ─── POST /auth/logout ─────────────────────────────────────────────────────
  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message:    'Logout failed: Unauthorized.',
          suggestion: 'Please login and try again.',
        });
      }

      await this.authUseCases.logout(userId);

      return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
      console.log('Error in logout controller:', error);
      return this.handleError(res, error, 'An error occurred during logout.');
    }
  };

  // ─── POST /auth/refresh-token ──────────────────────────────────────────────
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          message:    'Token refresh failed: No refresh token provided.',
          suggestion: 'Please provide a valid refresh token.',
        });
      }

      const result = await this.authUseCases.refreshToken({ refreshToken });

      return res.status(200).json({
        message: 'Token refreshed successfully.',
        data:    result,
      });
    } catch (error) {
      console.log('Error in refreshToken controller:', error);
      return this.handleError(res, error, 'An error occurred while refreshing the token.');
    }
  };

  // ─── POST /auth/send-otp ───────────────────────────────────────────────────
  sendOtp = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, purpose } = req.body;

      if (!email || !purpose) {
        return res.status(400).json({
          message:    'OTP send failed: Missing required fields.',
          suggestion: 'Please provide email and purpose (EMAIL_VERIFICATION or FORGOT_PASSWORD).',
        });
      }

      if (!Object.values(OtpPurpose).includes(purpose)) {
        return res.status(400).json({
          message:    'OTP send failed: Invalid purpose.',
          suggestion: `Purpose must be one of: ${Object.values(OtpPurpose).join(', ')}.`,
        });
      }

      await this.authUseCases.sendOtp({ email, purpose });

      return res.status(200).json({
        message: `OTP sent successfully to ${email}.`,
      });
    } catch (error) {
      console.log('Error in sendOtp controller:', error);
      return this.handleError(res, error, 'An error occurred while sending the OTP.');
    }
  };

  // ─── POST /auth/resend-otp ─────────────────────────────────────────────────
  resendOtp = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, purpose } = req.body;

      if (!email || !purpose) {
        return res.status(400).json({
          message:    'OTP resend failed: Missing required fields.',
          suggestion: 'Please provide email and purpose.',
        });
      }

      if (!Object.values(OtpPurpose).includes(purpose)) {
        return res.status(400).json({
          message:    'OTP resend failed: Invalid purpose.',
          suggestion: `Purpose must be one of: ${Object.values(OtpPurpose).join(', ')}.`,
        });
      }

      await this.authUseCases.resendOtp({ email, purpose });

      return res.status(200).json({
        message: `OTP resent successfully to ${email}.`,
      });
    } catch (error) {
      console.log('Error in resendOtp controller:', error);
      return this.handleError(res, error, 'An error occurred while resending the OTP.');
    }
  };

  // ─── POST /auth/validate-otp ───────────────────────────────────────────────
  validateOtp = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          message:    'OTP validation failed: Missing required fields.',
          suggestion: 'Please provide email and otp.',
        });
      }

      const result = await this.authUseCases.validateOtp({ email, otp });

      return res.status(200).json({
        message: 'OTP validated successfully.',
        data:    result,   // { resetToken }
      });
    } catch (error) {
      console.log('Error in validateOtp controller:', error);
      return this.handleError(res, error, 'An error occurred while validating the OTP.');
    }
  };

  // ─── POST /auth/verify-email ───────────────────────────────────────────────
  verifyEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          message:    'Email verification failed: Missing required fields.',
          suggestion: 'Please provide email and otp.',
        });
      }

      await this.authUseCases.verifyEmail({ email, otp });

      return res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
      console.log('Error in verifyEmail controller:', error);
      return this.handleError(res, error, 'An error occurred while verifying the email.');
    }
  };

  // ─── POST /auth/forgot-password ────────────────────────────────────────────
  forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message:    'Forgot password failed: Email is required.',
          suggestion: 'Please provide your registered email address.',
        });
      }

      await this.authUseCases.forgotPassword({ email });

      // Always return 200 to prevent user enumeration
      return res.status(200).json({
        message: 'If an account exists with this email, an OTP has been sent.',
      });
    } catch (error) {
      console.log('Error in forgotPassword controller:', error);
      return this.handleError(res, error, 'An error occurred while processing the forgot password request.');
    }
  };

  // ─── POST /auth/reset-password ─────────────────────────────────────────────
  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({
          message:    'Password reset failed: Missing required fields.',
          suggestion: 'Please provide email, otp, and newPassword.',
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          message:    'Password reset failed: Password too short.',
          suggestion: 'Password must be at least 8 characters long.',
        });
      }

      await this.authUseCases.resetPassword({ email, otp, newPassword });

      return res.status(200).json({
        message: 'Password reset successfully. Please login with your new password.',
      });
    } catch (error) {
      console.log('Error in resetPassword controller:', error);
      return this.handleError(res, error, 'An error occurred while resetting the password.');
    }
  };

  // ─── Shared error handler ──────────────────────────────────────────────────
  private handleError(res: Response, error: unknown, fallbackMessage: string): Response {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message:    error.message,
        suggestion: error.suggestion,
      });
    }

    return res.status(500).json({
      message:    fallbackMessage,
      suggestion: 'Please try again later or contact support.',
      error:      error instanceof Error ? error.message : 'Unknown error',
    });
  }
}