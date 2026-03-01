import nodemailer from 'nodemailer';
import type { IEmailService } from "../../application/interface/common/email-service-usecase.impl.js";
import { OtpPurpose } from "../../shared/enums/OtpPurpose.enum.js";

export class EmailService implements IEmailService {
  private _transporter: nodemailer.Transporter | null = null;
  private fromEmail: string = '';
  private fromName:  string = '';

  private get transporter(): nodemailer.Transporter {
    if (!this._transporter) {
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASS;

      if (!user || !pass) {
        throw new Error('EMAIL_USER or EMAIL_PASS is not set in .env');
      }

      this.fromEmail = process.env.SMTP_FROM_EMAIL || user;
      this.fromName  = process.env.SMTP_FROM_NAME  || 'App';

      this._transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });

    }
    return this._transporter;
  }

  async sendOtpEmail(to: string, otp: string, purpose: string): Promise<void> {
    const isForgotPassword = purpose === OtpPurpose.FORGOT_PASSWORD;
    const accentColor = isForgotPassword ? '#dc2626' : '#2563eb';
    const heading     = isForgotPassword ? 'Password Reset'      : 'Email Verification';
    const subject     = isForgotPassword ? 'Password Reset OTP'  : 'Verify Your Email';
    const intro       = isForgotPassword
      ? 'You requested to reset your password. Use the OTP below:'
      : 'Thank you for registering! Use the OTP below to verify your email:';

    await this.transporter.sendMail({
      from:    `"${this.fromName}" <${this.fromEmail}>`,
      to,
      subject,
      html: `
        <!DOCTYPE html><html>
        <head><style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${accentColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .otp-box { background: white; padding: 20px; text-align: center; margin: 20px 0; border: 2px dashed ${accentColor}; border-radius: 8px; }
          .otp { font-size: 36px; font-weight: bold; color: ${accentColor}; letter-spacing: 8px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style></head>
        <body><div class="container">
          <div class="header"><h1>${heading}</h1></div>
          <div class="content">
            <p>${intro}</p>
            <div class="otp-box"><div class="otp">${otp}</div></div>
            <p><strong>This OTP expires in 10 minutes.</strong></p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer"><p>&copy; ${new Date().getFullYear()} ${this.fromName}. All rights reserved.</p></div>
        </div></body></html>
      `,
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.transporter.sendMail({
      from:    `"${this.fromName}" <${this.fromEmail}>`,
      to,
      subject: `Welcome to ${this.fromName}!`,
      html: `
        <!DOCTYPE html><html>
        <head><style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style></head>
        <body><div class="container">
          <div class="header"><h1>Welcome Aboard! 🎉</h1></div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your email has been successfully verified!</p>
            <p>You can now log in and start using <strong>${this.fromName}</strong>.</p>
          </div>
          <div class="footer"><p>&copy; ${new Date().getFullYear()} ${this.fromName}. All rights reserved.</p></div>
        </div></body></html>
      `,
    });
  }

  async sendEmployeeInvitation(
    to: string, name: string, companyName: string, temporaryPassword: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from:    `"${this.fromName}" <${this.fromEmail}>`,
      to,
      subject: `You're invited to join ${companyName}`,
      html: `
        <!DOCTYPE html><html>
        <head><style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .credentials { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style></head>
        <body><div class="container">
          <div class="header"><h1>You're Invited! 🚀</h1></div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>You have been invited to join <strong>${companyName}</strong>.</p>
            <div class="credentials">
              <p><strong>Email:</strong> ${to}</p>
              <p><strong>Temporary Password:</strong> <code>${temporaryPassword}</code></p>
            </div>
            <p><strong>Important:</strong> Please change your password after first login.</p>
          </div>
          <div class="footer"><p>&copy; ${new Date().getFullYear()} ${this.fromName}. All rights reserved.</p></div>
        </div></body></html>
      `,
    });
  }

  async sendPasswordResetConfirmation(to: string, name: string): Promise<void> {
    await this.transporter.sendMail({
      from:    `"${this.fromName}" <${this.fromEmail}>`,
      to,
      subject: 'Your password has been reset',
      html: `
        <!DOCTYPE html><html>
        <head><style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style></head>
        <body><div class="container">
          <div class="header"><h1>Password Reset Successful</h1></div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your password has been successfully reset.</p>
            <p>If you did not make this change, contact support immediately.</p>
          </div>
          <div class="footer"><p>&copy; ${new Date().getFullYear()} ${this.fromName}. All rights reserved.</p></div>
        </div></body></html>
      `,
    });
  }
}