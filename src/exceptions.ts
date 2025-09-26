/**
 * LicenseChain Node.js SDK Exceptions
 */

export class LicenseChainException extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string = 'LICENSE_CHAIN_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'LicenseChainException';
    this.code = code;
    this.statusCode = statusCode;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LicenseChainException);
    }
  }
}

export class AuthenticationException extends LicenseChainException {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationException';
  }
}

export class ValidationException extends LicenseChainException {
  constructor(message: string = 'Validation failed') {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationException';
  }
}

export class NotFoundException extends LicenseChainException {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundException';
  }
}

export class RateLimitException extends LicenseChainException {
  public readonly retryAfter: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter: number = 60) {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'RateLimitException';
    this.retryAfter = retryAfter;
  }
}

export class ServerException extends LicenseChainException {
  constructor(message: string = 'Server error') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerException';
  }
}

export class NetworkException extends LicenseChainException {
  constructor(message: string = 'Network error') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkException';
  }
}

export class LicenseExpiredException extends LicenseChainException {
  constructor(message: string = 'License has expired') {
    super(message, 'LICENSE_EXPIRED_ERROR', 410);
    this.name = 'LicenseExpiredException';
  }
}

export class LicenseSuspendedException extends LicenseChainException {
  constructor(message: string = 'License has been suspended') {
    super(message, 'LICENSE_SUSPENDED_ERROR', 403);
    this.name = 'LicenseSuspendedException';
  }
}

export class HardwareLimitExceededException extends LicenseChainException {
  constructor(message: string = 'Hardware limit exceeded') {
    super(message, 'HARDWARE_LIMIT_EXCEEDED_ERROR', 403);
    this.name = 'HardwareLimitExceededException';
  }
}

export class ValidationLimitExceededException extends LicenseChainException {
  constructor(message: string = 'Validation limit exceeded') {
    super(message, 'VALIDATION_LIMIT_EXCEEDED_ERROR', 403);
    this.name = 'ValidationLimitExceededException';
  }
}

export class WebhookVerificationException extends LicenseChainException {
  constructor(message: string = 'Webhook signature verification failed') {
    super(message, 'WEBHOOK_VERIFICATION_ERROR', 400);
    this.name = 'WebhookVerificationException';
  }
}

export class ConfigurationException extends LicenseChainException {
  constructor(message: string = 'Configuration error') {
    super(message, 'CONFIGURATION_ERROR', 500);
    this.name = 'ConfigurationException';
  }
}