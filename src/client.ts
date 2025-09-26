/**
 * LicenseChain Node.js Client
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import crypto from 'crypto';
import { LicenseChainException, AuthenticationException, ValidationException, NotFoundException, RateLimitException, ServerException, NetworkException } from './exceptions';
import { LicenseData, UserData, ApplicationData, AnalyticsData, WebhookData, ValidationResult, CreateLicenseData, UpdateLicenseData } from './types';

export class LicenseChainClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private client: AxiosInstance;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
  }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.licensechain.app';
    this.timeout = config.timeout || 30000;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'LicenseChain-NodeJS-SDK/1.0.0'
      }
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making request to ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              throw new AuthenticationException(data.message || 'Authentication failed');
            case 400:
              throw new ValidationException(data.message || 'Validation failed');
            case 404:
              throw new NotFoundException(data.message || 'Resource not found');
            case 429:
              throw new RateLimitException(data.message || 'Rate limit exceeded');
            case 500:
            case 502:
            case 503:
            case 504:
              throw new ServerException(data.message || 'Server error');
            default:
              throw new LicenseChainException(data.message || 'Request failed');
          }
        } else if (error.request) {
          throw new NetworkException('Network error: No response received');
        } else {
          throw new LicenseChainException(error.message);
        }
      }
    );
  }

  /**
   * Validate a license key
   */
  async validateLicense(licenseKey: string, hardwareId?: string): Promise<ValidationResult> {
    try {
      const response: AxiosResponse<ValidationResult> = await this.client.post('/api/licenses/validate', {
        licenseKey,
        hardwareId: hardwareId || this.generateHardwareId()
      });
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`License validation failed: ${error.message}`);
    }
  }

  /**
   * Get license information
   */
  async getLicense(licenseId: string): Promise<LicenseData> {
    try {
      const response: AxiosResponse<LicenseData> = await this.client.get(`/api/licenses/${licenseId}`);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to get license: ${error.message}`);
    }
  }

  /**
   * Get user licenses
   */
  async getUserLicenses(userId: string): Promise<LicenseData[]> {
    try {
      const response: AxiosResponse<{ data: LicenseData[] }> = await this.client.get(`/api/users/${userId}/licenses`);
      return response.data.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to get user licenses: ${error.message}`);
    }
  }

  /**
   * Create a new license
   */
  async createLicense(licenseData: CreateLicenseData): Promise<LicenseData> {
    try {
      const response: AxiosResponse<LicenseData> = await this.client.post('/api/licenses', licenseData);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to create license: ${error.message}`);
    }
  }

  /**
   * Update license
   */
  async updateLicense(licenseId: string, updateData: UpdateLicenseData): Promise<LicenseData> {
    try {
      const response: AxiosResponse<LicenseData> = await this.client.put(`/api/licenses/${licenseId}`, updateData);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to update license: ${error.message}`);
    }
  }

  /**
   * Revoke license
   */
  async revokeLicense(licenseId: string): Promise<void> {
    try {
      await this.client.delete(`/api/licenses/${licenseId}`);
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to revoke license: ${error.message}`);
    }
  }

  /**
   * Get license analytics
   */
  async getLicenseAnalytics(licenseId: string, period: string = '30d'): Promise<AnalyticsData> {
    try {
      const response: AxiosResponse<AnalyticsData> = await this.client.get(`/api/licenses/${licenseId}/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to get license analytics: ${error.message}`);
    }
  }

  /**
   * Get user information
   */
  async getUser(userId: string): Promise<UserData> {
    try {
      const response: AxiosResponse<UserData> = await this.client.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Create user
   */
  async createUser(userData: Partial<UserData>): Promise<UserData> {
    try {
      const response: AxiosResponse<UserData> = await this.client.post('/api/users', userData);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updateData: Partial<UserData>): Promise<UserData> {
    try {
      const response: AxiosResponse<UserData> = await this.client.put(`/api/users/${userId}`, updateData);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Get application information
   */
  async getApplication(appId: string): Promise<ApplicationData> {
    try {
      const response: AxiosResponse<ApplicationData> = await this.client.get(`/api/applications/${appId}`);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to get application: ${error.message}`);
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(period: string = '30d', metrics: string[] = []): Promise<AnalyticsData> {
    try {
      const response: AxiosResponse<AnalyticsData> = await this.client.get(`/api/analytics?period=${period}&metrics=${metrics.join(',')}`);
      return response.data;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`Failed to get analytics: ${error.message}`);
    }
  }

  /**
   * Send webhook notification
   */
  async sendWebhook(webhookUrl: string, data: WebhookData): Promise<void> {
    try {
      await axios.post(webhookUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LicenseChain-NodeJS-SDK/1.0.0'
        }
      });
    } catch (error) {
      throw new LicenseChainException(`Failed to send webhook: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new LicenseChainException(`Health check failed: ${error.message}`);
    }
  }

  /**
   * Generate hardware ID
   */
  private generateHardwareId(): string {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    const macAddress = Object.values(networkInterfaces)
      .flat()
      .find(iface => iface && !iface.internal && iface.mac !== '00:00:00:00:00:00')
      ?.mac || 'unknown';
    
    return crypto.createHash('sha256').update(macAddress).digest('hex').substring(0, 16);
  }
}