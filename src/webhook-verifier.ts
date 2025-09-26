/**
 * Webhook Verifier for LicenseChain Node.js SDK
 */

import crypto from 'crypto';
import { WebhookData } from './types';
import { WebhookVerificationException } from './exceptions';

export class WebhookVerifier {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Verify webhook signature
   */
  verify(payload: string, signature: string): boolean {
    try {
      const expectedSignature = this.generateSignature(payload);
      return this.compareSignatures(signature, expectedSignature);
    } catch (error) {
      throw new WebhookVerificationException(`Signature verification failed: ${error.message}`);
    }
  }

  /**
   * Verify webhook data
   */
  verifyWebhookData(webhookData: WebhookData): boolean {
    try {
      // Check required fields
      if (!webhookData.event || !webhookData.data || !webhookData.timestamp) {
        return false;
      }

      // Check timestamp (prevent replay attacks)
      const now = new Date().getTime();
      const webhookTime = new Date(webhookData.timestamp).getTime();
      const timeDiff = Math.abs(now - webhookTime);
      
      // Allow 5 minutes tolerance
      if (timeDiff > 5 * 60 * 1000) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate signature for payload
   */
  private generateSignature(payload: string): string {
    return crypto
      .createHmac('sha256', this.secret)
      .update(payload, 'utf8')
      .digest('hex');
  }

  /**
   * Compare signatures securely
   */
  private compareSignatures(signature1: string, signature2: string): boolean {
    if (signature1.length !== signature2.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(signature1, 'hex'),
      Buffer.from(signature2, 'hex')
    );
  }

  /**
   * Parse webhook payload
   */
  parseWebhookPayload(payload: string, signature: string): WebhookData {
    try {
      // Verify signature first
      if (!this.verify(payload, signature)) {
        throw new WebhookVerificationException('Invalid webhook signature');
      }

      // Parse JSON payload
      const webhookData: WebhookData = JSON.parse(payload);

      // Verify webhook data structure
      if (!this.verifyWebhookData(webhookData)) {
        throw new WebhookVerificationException('Invalid webhook data');
      }

      return webhookData;
    } catch (error) {
      if (error instanceof WebhookVerificationException) {
        throw error;
      }
      throw new WebhookVerificationException(`Failed to parse webhook payload: ${error.message}`);
    }
  }

  /**
   * Create webhook signature
   */
  createSignature(payload: string): string {
    return `sha256=${this.generateSignature(payload)}`;
  }

  /**
   * Validate webhook event type
   */
  isValidEventType(eventType: string): boolean {
    const validEvents = [
      'license.created',
      'license.updated',
      'license.deleted',
      'license.validated',
      'license.expired',
      'license.suspended',
      'user.created',
      'user.updated',
      'user.deleted',
      'application.created',
      'application.updated',
      'application.deleted',
      'payment.completed',
      'payment.failed',
      'subscription.created',
      'subscription.updated',
      'subscription.cancelled'
    ];

    return validEvents.includes(eventType);
  }

  /**
   * Get webhook event handler
   */
  getEventHandler(eventType: string): string {
    const eventHandlers: Record<string, string> = {
      'license.created': 'onLicenseCreated',
      'license.updated': 'onLicenseUpdated',
      'license.deleted': 'onLicenseDeleted',
      'license.validated': 'onLicenseValidated',
      'license.expired': 'onLicenseExpired',
      'license.suspended': 'onLicenseSuspended',
      'user.created': 'onUserCreated',
      'user.updated': 'onUserUpdated',
      'user.deleted': 'onUserDeleted',
      'application.created': 'onApplicationCreated',
      'application.updated': 'onApplicationUpdated',
      'application.deleted': 'onApplicationDeleted',
      'payment.completed': 'onPaymentCompleted',
      'payment.failed': 'onPaymentFailed',
      'subscription.created': 'onSubscriptionCreated',
      'subscription.updated': 'onSubscriptionUpdated',
      'subscription.cancelled': 'onSubscriptionCancelled'
    };

    return eventHandlers[eventType] || 'onUnknownEvent';
  }
}
