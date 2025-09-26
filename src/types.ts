/**
 * TypeScript type definitions for LicenseChain Node.js SDK
 */

export interface LicenseData {
  id: string;
  key: string;
  applicationId: string;
  applicationName: string;
  userId: string;
  status: 'active' | 'expired' | 'suspended' | 'cancelled';
  plan: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  currency: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  features: string[];
  usage: {
    totalValidations: number;
    lastValidated: string;
    maxValidations: number;
  };
  hardware: {
    id: string;
    fingerprint: string;
    name: string;
    lastSeen: string;
  }[];
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'user' | 'admin' | 'seller';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  preferences: {
    notifications: boolean;
    marketing: boolean;
    language: string;
    timezone: string;
  };
  statistics: {
    totalLicenses: number;
    activeLicenses: number;
    totalSpent: number;
    currency: string;
  };
}

export interface ApplicationData {
  id: string;
  name: string;
  description: string;
  sellerId: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  settings: {
    allowMultipleDevices: boolean;
    maxDevices: number;
    requireHardwareId: boolean;
  };
  pricing: {
    monthly: number;
    yearly: number;
    lifetime: number;
    currency: string;
  };
}

export interface AnalyticsData {
  period: string;
  totalRevenue: number;
  activeLicenses: number;
  totalUsers: number;
  conversionRate: number;
  growthRate: number;
  revenue: {
    total: number;
    growth: number;
    byPeriod: Array<{
      date: string;
      amount: number;
    }>;
  };
  licenses: {
    total: number;
    active: number;
    expired: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    growth: number;
  };
  usage: {
    totalValidations: number;
    averagePerDay: number;
    peakUsage: {
      date: string;
      validations: number;
    };
  };
}

export interface WebhookData {
  event: string;
  data: any;
  timestamp: string;
  signature: string;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
  licenseId?: string;
  expiresAt?: string;
  features?: string[];
  usage?: {
    totalValidations: number;
    lastValidated: string;
    maxValidations: number;
  };
}

export interface CreateLicenseData {
  applicationId: string;
  userId: string;
  plan: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  currency: string;
  features?: string[];
  maxValidations?: number;
  expiresAt?: string;
}

export interface UpdateLicenseData {
  status?: 'active' | 'suspended' | 'cancelled';
  features?: string[];
  maxValidations?: number;
  expiresAt?: string;
}

export interface LicenseChainConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchOptions {
  query?: string;
  filters?: Record<string, any>;
  pagination?: PaginationOptions;
}

export interface LicenseSearchOptions extends SearchOptions {
  status?: 'active' | 'expired' | 'suspended' | 'cancelled';
  plan?: 'monthly' | 'yearly' | 'lifetime';
  applicationId?: string;
  userId?: string;
}

export interface UserSearchOptions extends SearchOptions {
  role?: 'user' | 'admin' | 'seller';
  status?: 'active' | 'inactive' | 'suspended';
  email?: string;
}

export interface AnalyticsOptions {
  period?: '7d' | '30d' | '90d' | '1y' | 'all';
  metrics?: string[];
  groupBy?: string;
  startDate?: string;
  endDate?: string;
}

export interface LicenseChainResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  timestamp: string;
}