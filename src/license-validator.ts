/**
 * License Validator for LicenseChain Node.js SDK
 */

import crypto from 'crypto';
import { LicenseData, ValidationResult } from './types';
import { LicenseChainException, LicenseExpiredException, LicenseSuspendedException, HardwareLimitExceededException, ValidationLimitExceededException } from './exceptions';

export class LicenseValidator {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Validate a license key
   */
  async validate(licenseKey: string, hardwareId?: string): Promise<ValidationResult> {
    try {
      // Validate license key format
      if (!this.isValidLicenseKeyFormat(licenseKey)) {
        return {
          valid: false,
          message: 'Invalid license key format'
        };
      }

      // Get license data from API
      const licenseData = await this.client.getLicense(licenseKey);
      
      // Perform validation checks
      const validation = await this.performValidation(licenseData, hardwareId);
      
      return validation;
    } catch (error) {
      if (error instanceof LicenseChainException) {
        throw error;
      }
      throw new LicenseChainException(`License validation failed: ${error.message}`);
    }
  }

  /**
   * Perform comprehensive license validation
   */
  private async performValidation(license: LicenseData, hardwareId?: string): Promise<ValidationResult> {
    // Check if license exists and is active
    if (!license) {
      return {
        valid: false,
        message: 'License not found'
      };
    }

    // Check license status
    if (license.status === 'suspended') {
      throw new LicenseSuspendedException('License has been suspended');
    }

    if (license.status === 'cancelled') {
      return {
        valid: false,
        message: 'License has been cancelled'
      };
    }

    // Check if license is expired
    if (license.status === 'expired' || this.isLicenseExpired(license)) {
      throw new LicenseExpiredException('License has expired');
    }

    // Check hardware limits
    if (hardwareId && !this.isHardwareAllowed(license, hardwareId)) {
      throw new HardwareLimitExceededException('Hardware limit exceeded for this license');
    }

    // Check validation limits
    if (this.isValidationLimitExceeded(license)) {
      throw new ValidationLimitExceededException('Validation limit exceeded for this license');
    }

    // Update usage statistics
    await this.updateUsageStatistics(license, hardwareId);

    return {
      valid: true,
      message: 'License is valid and active',
      licenseId: license.id,
      expiresAt: license.expiresAt,
      features: license.features,
      usage: license.usage
    };
  }

  /**
   * Check if license key has valid format
   */
  private isValidLicenseKeyFormat(licenseKey: string): boolean {
    // License key format: LC-XXXXXXXX-XXXXXXXX-XXXXXXXX
    const licenseKeyRegex = /^LC-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}$/;
    return licenseKeyRegex.test(licenseKey);
  }

  /**
   * Check if license is expired
   */
  private isLicenseExpired(license: LicenseData): boolean {
    if (!license.expiresAt) {
      return false; // Lifetime license
    }

    const now = new Date();
    const expiresAt = new Date(license.expiresAt);
    
    return now > expiresAt;
  }

  /**
   * Check if hardware is allowed for this license
   */
  private isHardwareAllowed(license: LicenseData, hardwareId: string): boolean {
    if (!license.hardware || license.hardware.length === 0) {
      return true; // No hardware restrictions
    }

    // Check if hardware ID is already registered
    const isRegistered = license.hardware.some(hw => hw.fingerprint === hardwareId);
    
    if (isRegistered) {
      return true;
    }

    // Check if we can add new hardware (based on application settings)
    // This would require additional API call to get application settings
    return license.hardware.length < 5; // Default limit
  }

  /**
   * Check if validation limit is exceeded
   */
  private isValidationLimitExceeded(license: LicenseData): boolean {
    if (license.usage.maxValidations === -1) {
      return false; // Unlimited validations
    }

    return license.usage.totalValidations >= license.usage.maxValidations;
  }

  /**
   * Update usage statistics
   */
  private async updateUsageStatistics(license: LicenseData, hardwareId?: string): Promise<void> {
    try {
      // Update validation count
      const updatedUsage = {
        ...license.usage,
        totalValidations: license.usage.totalValidations + 1,
        lastValidated: new Date().toISOString()
      };

      // Update hardware information if provided
      if (hardwareId) {
        const existingHardware = license.hardware.find(hw => hw.fingerprint === hardwareId);
        
        if (existingHardware) {
          existingHardware.lastSeen = new Date().toISOString();
        } else {
          license.hardware.push({
            id: crypto.randomUUID(),
            fingerprint: hardwareId,
            name: 'Unknown Device',
            lastSeen: new Date().toISOString()
          });
        }
      }

      // Update license in API
      await this.client.updateLicense(license.id, {
        usage: updatedUsage,
        hardware: license.hardware
      });
    } catch (error) {
      console.warn('Failed to update usage statistics:', error.message);
      // Don't throw error as validation should still succeed
    }
  }

  /**
   * Generate hardware ID from system information
   */
  generateHardwareId(): string {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    const macAddress = Object.values(networkInterfaces)
      .flat()
      .find(iface => iface && !iface.internal && iface.mac !== '00:00:00:00:00:00')
      ?.mac || 'unknown';
    
    return crypto.createHash('sha256').update(macAddress).digest('hex').substring(0, 16);
  }

  /**
   * Check if license has specific feature
   */
  hasFeature(license: LicenseData, feature: string): boolean {
    return license.features.includes(feature);
  }

  /**
   * Get days until expiration
   */
  getDaysUntilExpiration(license: LicenseData): number | null {
    if (!license.expiresAt) {
      return null; // Lifetime license
    }

    const now = new Date();
    const expiresAt = new Date(license.expiresAt);
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Check if license is near expiration
   */
  isNearExpiration(license: LicenseData, daysThreshold: number = 7): boolean {
    const daysUntilExpiration = this.getDaysUntilExpiration(license);
    return daysUntilExpiration !== null && daysUntilExpiration <= daysThreshold;
  }
}
