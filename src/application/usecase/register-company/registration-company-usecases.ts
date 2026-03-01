import bcrypt from 'bcryptjs';

import {
  PaymentProvider,
  PaymentStatus,
  PaymentType,
  SubscriptionStatus,
  SystemRole,
} from '../../../shared/enums/registration.enum.js';
import type { IRegistrationUseCases } from '../../interface/register-company/registration-usecase-impl.js';
import type { GetModulesResponseDTO, InitiatePaymentRequestDTO, InitiatePaymentResponseDTO, RegisterCompanyRequestDTO, RegisterCompanyResponseDTO, VerifyPaymentRequestDTO, VerifyPaymentResponseDTO } from '../../../domain/dtos/user-usecaase/registration-dto.js';
import { BadRequestError, ConflictError, NotFoundError } from '../../../domain/error/app-error.js';
import type { ICompanyRepository, IModuleRepository, IModuleSubscriptionRepository, IPaymentTransactionRepository, IRoleRepository, ISubscriptionHistoryRepository } from '../../../domain/repository/registration-repository-impl.js';
import type { IUserRepository } from '../../../domain/repository/user-repository-impl.js';
import type { IEmailService } from '../../interface/common/email-service-usecase.impl.js';
import type { IModuleValidationService } from '../../interface/register-company/module-validation-service-impl.js';
import type { IPaymentService } from '../../interface/register-company/payment-service-impl.js';

const SALT_ROUNDS = 12;
const SUB_MONTHS  = 1;   // default subscription duration

export class RegistrationUseCases implements IRegistrationUseCases {
  constructor(
    private readonly moduleRepository:              IModuleRepository,
    private readonly companyRepository:             ICompanyRepository,
    private readonly roleRepository:                IRoleRepository,
    private readonly userRepository:                IUserRepository,
    private readonly paymentTransactionRepository:  IPaymentTransactionRepository,
    private readonly moduleSubscriptionRepository:  IModuleSubscriptionRepository,
    private readonly subscriptionHistoryRepository: ISubscriptionHistoryRepository,
    private readonly paymentService:                IPaymentService,
    private readonly emailService:                  IEmailService,
    private readonly moduleValidationService:       IModuleValidationService,  // ← injected
  ) {}

  // ─── STEP 1 : List active modules ─────────────────────────────────────────
  async getAvailableModules(): Promise<GetModulesResponseDTO[]> {
    const modules = await this.moduleRepository.findAll();

    if (!modules || modules.length === 0) {
      throw new NotFoundError(
        'No active modules found.',
        'Please check the database or try again later.'
      );
    }

    return modules.map((m) => ({
      _id:           m._id!,
      key:           m.key,
      name:          m.name,
      description:   m.description,
      pricePerMonth: m.pricePerMonth,
    }));
  }
 
  // ─── STEP 2 : Register company + admin (single call) ──────────────────────
  async registerCompany(data: RegisterCompanyRequestDTO): Promise<RegisterCompanyResponseDTO> {

    // ── 2a. Validate modules via internal service (no HTTP endpoint needed) ──
    const selectedModules = await this.moduleValidationService.validateAndResolve(
      data.selectedModuleKeys
    );
    const pricing = this.moduleValidationService.computePricing(selectedModules);

    // ── 2b. Guard: GSTIN uniqueness ──────────────────────────────────────────
    const existingCompany = await this.companyRepository.findByGSTIN(data.legal.legalName);
    if (existingCompany) {
      throw new ConflictError(
        'A company with this GSTIN is already registered.',
        'Please use a different GSTIN or contact support.'
      );
    }

    // ── 2c. Guard: Admin email uniqueness ────────────────────────────────────
    const existingUser = await this.userRepository.findByEmail(data.admin.email);
    if (existingUser) {
      throw new ConflictError(
        'An account with this email already exists.',
        'Please use a different email or login to your existing account.'
      );
    }

    // ── 2d. Resolve system Admin role ────────────────────────────────────────
    const adminRole = await this.roleRepository.findOrCreate(
     SystemRole.ADMIN,
    'Company owner with full access to their company modules.',
    true
    );
    // ── 2e. Persist company (inactive until payment confirmed) ───────────────
    const company = await this.companyRepository.create({
      name:         data.name,
      address:      data.address,
      contact:      data.contact,
      companySize:  data.companySize,
      legal:        data.legal,
      branding:     data.branding,
      industryType: data.industryType,
      isActive:     false,
    });

    // ── 2f. Hash password and create admin user ──────────────────────────────
    const hashedPassword = await bcrypt.hash(data.admin.password, SALT_ROUNDS);

    const adminUser = await (this.userRepository as any).create({
      firstName:       data.admin.firstName,
      lastName:        data.admin.lastName,
      email:           data.admin.email,
      password:        hashedPassword,
      phone:           data.admin.phone,
      companyId:       company._id,
      roleId:          adminRole._id,
      isEmailVerified: false,
      isActive:        false,   
    });

    // ── 2g. Trigger OTP email for admin email verification ───────────────────
    //    (Actual OTP is generated + sent via the auth send-otp endpoint)
    await this.emailService.sendOtpEmail(
      data.admin.email,
      'PENDING_VERIFY',
      'EMAIL_VERIFICATION'
    );

    return {
      companyId:   company._id!,
      companyName: company.name,
      adminId:     adminUser._id!,
      adminEmail:  adminUser.email,
      selectedModules: selectedModules.map((m: any) => ({
        key:           m.key,
        name:          m.name,
        pricePerMonth: m.pricePerMonth,
      })),
      subtotalAmount: pricing.subtotalAmount,
      taxAmount:      pricing.taxAmount,
      totalAmount:    pricing.totalAmount,
      currency:       pricing.currency,
      message:        'Company registered successfully. Please verify the admin email to continue.',
    };
  }

  // ─── STEP 3a : Initiate payment ───────────────────────────────────────────
 async initiatePayment(data: InitiatePaymentRequestDTO): Promise<InitiatePaymentResponseDTO> {
  const company = await this.companyRepository.findById(data.companyId);
  if (!company) {
    throw new NotFoundError(
      'Company not found.',
      'Please complete the company registration step first.'
    );
  }

  const selectedModules = await this.moduleValidationService.validateAndResolve(
    data.selectedModuleKeys
  );
  const { totalAmount, subtotalAmount, taxAmount } =
    this.moduleValidationService.computePricing(selectedModules);

  const currency      = data.currency || 'INR';
  const amountInPaise = Math.round(totalAmount * 100);

  const transaction = await this.paymentTransactionRepository.create({
    companyId:          data.companyId,
    totalAmount,
    subtotalAmount,
    taxAmount,
    currency,
    paymentStatus:      PaymentStatus.PENDING,
    paymentMethod:      'stripe',
    paymentType:        PaymentType.MODULE_PURCHASE,
    billingCycleMonths: 1,
    purchasedModules:   data.selectedModuleKeys,  
  });
  console.log(transaction , "1231234")

  const stripeResult = await this.paymentService.createStripePaymentIntent({
    amount:   amountInPaise,
    currency: currency.toLowerCase(),
    receipt:  transaction._id,
  });

  await this.paymentTransactionRepository.updateStatus(
    transaction._id!,
    PaymentStatus.PENDING,
    stripeResult.paymentIntentId,
  );

  return {
    transactionId: transaction._id!,
    clientSecret:  stripeResult.clientSecret,
  };
}

async verifyAndActivate(data: VerifyPaymentRequestDTO): Promise<VerifyPaymentResponseDTO> {
  const transaction = await this.paymentTransactionRepository.findById(data.transactionId);
  if (!transaction) {
    throw new NotFoundError(
      'Payment transaction not found.',
      'Please check the transaction ID and try again.'
    );
  }

  if (transaction.paymentStatus === PaymentStatus.SUCCESS) {
    throw new BadRequestError(
      'This transaction has already been processed.',
      'Please check your subscription status.'
    );
  }

  const stripeResult = await this.paymentService.verifyStripePayment(data.paymentIntentId!);
  console.log("2", stripeResult)
  await this.paymentTransactionRepository.updateStatus(
    data.transactionId,
    stripeResult.success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
    data.paymentIntentId,
    undefined,
    stripeResult.receiptUrl,
    stripeResult.success ? new Date() : undefined
  );

  if (!stripeResult.success) {
    throw new BadRequestError(
      'Payment verification failed.',
      'Please retry the payment or contact support.'
    );
  }

  const company = await this.companyRepository.findById(transaction.companyId);
  if (!company) throw new NotFoundError('Company not found.', 'Please contact support.');

  await this.companyRepository.updateIsActive(transaction.companyId, true);
  await (this.userRepository as any).activateByCompanyId(transaction.companyId);

  const modules   = await this.moduleRepository.findAll();
  const startDate = new Date();
  const endDate   = new Date();
  endDate.setMonth(endDate.getMonth() + SUB_MONTHS);

  await this.moduleSubscriptionRepository.createMany(
    modules.map((m: any) => ({
      companyId: transaction.companyId,
      moduleKey: m.key,
      startDate,
      endDate,
      status:    SubscriptionStatus.ACTIVE,
    }))
  );

  await this.subscriptionHistoryRepository.create({
    purchasedModules: modules.map((m: any) => m.key),
    companyId:        transaction.companyId,
    transactionId:    transaction._id!,
    price:            transaction.totalAmount.toString(),
    startDate,
    endDate,
  });

  return {
    message:            'Payment verified and subscription activated successfully.',
    transactionId:      transaction._id!,
    paymentStatus:      PaymentStatus.SUCCESS,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    activatedModules:   modules.map((m: any) => m.key),
    startDate,
    endDate,
  };
}
}