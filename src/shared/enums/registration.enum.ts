export enum PaymentProvider {
  STRIPE    = 'stripe',
}

export enum PaymentStatus {
  PENDING  = 'pending',
  SUCCESS  = 'success',
  FAILED   = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  MODULE_PURCHASE = 'module_purchase',
  MODULE_RENEWAL  = 'module_renewal',
  UPGRADE         = 'upgrade',
  DOWNGRADE       = 'downgrade',
  WEBSITE         = 'website',
}

export enum SubscriptionStatus {
  ACTIVE   = 'active',
  INACTIVE = 'inactive',
  EXPIRED  = 'expired',
}

export enum ModuleKey {
  LEAD       = 'LEAD',
  DESIGN     = 'DESIGN',
  BOQ        = 'BOQ',
  SCHEDULING = 'SCHEDULING',
  TASKS      = 'TASKS',
}

export enum SystemRole {
  SUPER_ADMIN = 'superAdmin',
  ADMIN       = 'admin',
}