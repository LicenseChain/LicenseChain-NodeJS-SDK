# 🔗 LicenseChain Node.js SDK

**Official Node.js SDK for LicenseChain license management**

[![License](https://img.shields.io/badge/license-Elastic%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3%2B-blue.svg)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://www.npmjs.com/package/@licensechain/nodejs-sdk)

## ✨ Features

### 🔐 **License Management**
- Validate license keys in real-time
- Create, update, and revoke licenses
- Track license usage and analytics
- Hardware binding and device limits
- Feature-based licensing

### 📊 **Advanced Analytics**
- Real-time usage statistics
- Revenue tracking and reporting
- User behavior analytics
- Custom metrics and dashboards
- Export capabilities

### 🔗 **Webhook Integration**
- Real-time event notifications
- Secure signature verification
- Event filtering and routing
- Retry mechanisms
- Error handling

### 🛡️ **Security**
- JWT-based authentication
- Request signing and verification
- Rate limiting protection
- Input validation and sanitization
- Hardware fingerprinting

### 🚀 **Performance**
- Connection pooling
- Request caching
- Automatic retries
- Timeout handling
- Error recovery

## 🚀 Quick Start

### Installation

```bash
npm install @licensechain/nodejs-sdk
```

### Basic Usage

```javascript
const { LicenseChainClient } = require('@licensechain/nodejs-sdk');

// Initialize client
const client = new LicenseChainClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.licensechain.app' // Optional
});

// Validate license
async function validateLicense() {
  try {
    const result = await client.validateLicense('LC-ABC123-DEF456-GHI789');
    
    if (result.valid) {
      console.log('License is valid!');
      console.log('Features:', result.features);
      console.log('Expires:', result.expiresAt);
    } else {
      console.log('License is invalid:', result.message);
    }
  } catch (error) {
    console.error('Validation error:', error.message);
  }
}

validateLicense();
```

### TypeScript Usage

```typescript
import { LicenseChainClient, LicenseData, ValidationResult } from '@licensechain/nodejs-sdk';

const client = new LicenseChainClient({
  apiKey: 'your-api-key'
});

async function validateLicense(): Promise<void> {
  try {
    const result: ValidationResult = await client.validateLicense('LC-ABC123-DEF456-GHI789');
    
    if (result.valid) {
      console.log('License is valid!');
    }
  } catch (error) {
    console.error('Validation error:', error.message);
  }
}
```

## 📚 API Reference

### LicenseChainClient

#### Constructor

```javascript
new LicenseChainClient({
  apiKey: string,           // Required: Your API key
  baseUrl?: string,         // Optional: API base URL (default: https://api.licensechain.app)
  timeout?: number          // Optional: Request timeout in ms (default: 30000)
})
```

#### Methods

##### License Management

```javascript
// Validate license key
await client.validateLicense(licenseKey, hardwareId?)

// Get license information
await client.getLicense(licenseId)

// Get user licenses
await client.getUserLicenses(userId)

// Create new license
await client.createLicense(licenseData)

// Update license
await client.updateLicense(licenseId, updateData)

// Revoke license
await client.revokeLicense(licenseId)

// Get license analytics
await client.getLicenseAnalytics(licenseId, period?)
```

##### User Management

```javascript
// Get user information
await client.getUser(userId)

// Create user
await client.createUser(userData)

// Update user
await client.updateUser(userId, updateData)
```

##### Analytics

```javascript
// Get analytics data
await client.getAnalytics(period?, metrics?)

// Get application information
await client.getApplication(appId)
```

##### Webhooks

```javascript
// Send webhook notification
await client.sendWebhook(webhookUrl, data)

// Verify webhook signature
client.verifyWebhookSignature(payload, signature, secret)
```

##### Utilities

```javascript
// Health check
await client.healthCheck()
```

### LicenseValidator

```javascript
const { LicenseValidator } = require('@licensechain/nodejs-sdk');

const validator = new LicenseValidator(client);

// Validate license with additional checks
const result = await validator.validate(licenseKey, hardwareId);

// Check if license has feature
const hasFeature = validator.hasFeature(license, 'premium-feature');

// Get days until expiration
const daysLeft = validator.getDaysUntilExpiration(license);

// Check if near expiration
const isNearExpiry = validator.isNearExpiration(license, 7); // 7 days threshold
```

### WebhookVerifier

```javascript
const { WebhookVerifier } = require('@licensechain/nodejs-sdk');

const verifier = new WebhookVerifier(webhookSecret);

// Verify webhook signature
const isValid = verifier.verify(payload, signature);

// Parse webhook payload
const webhookData = verifier.parseWebhookPayload(payload, signature);

// Create signature
const signature = verifier.createSignature(payload);
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
LICENSE_CHAIN_API_KEY=your_api_key

# Optional
LICENSE_CHAIN_API_URL=https://api.licensechain.app
LICENSE_CHAIN_TIMEOUT=30000
LICENSE_CHAIN_WEBHOOK_SECRET=your_webhook_secret
```

### Error Handling

```javascript
const { 
  LicenseChainException,
  AuthenticationException,
  ValidationException,
  NotFoundException,
  RateLimitException,
  ServerException,
  NetworkException
} = require('@licensechain/nodejs-sdk');

try {
  await client.validateLicense(licenseKey);
} catch (error) {
  if (error instanceof AuthenticationException) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof ValidationException) {
    console.error('Validation failed:', error.message);
  } else if (error instanceof RateLimitException) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter, 'seconds');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## 🔗 Webhook Integration

### Express.js Example

```javascript
const express = require('express');
const { WebhookVerifier } = require('@licensechain/nodejs-sdk');

const app = express();
const verifier = new WebhookVerifier(process.env.WEBHOOK_SECRET);

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-licensechain-signature'];
  const payload = req.body.toString();

  try {
    const webhookData = verifier.parseWebhookPayload(payload, signature);
    
    // Handle webhook event
    switch (webhookData.event) {
      case 'license.created':
        console.log('New license created:', webhookData.data);
        break;
      case 'license.validated':
        console.log('License validated:', webhookData.data);
        break;
      case 'license.expired':
        console.log('License expired:', webhookData.data);
        break;
      default:
        console.log('Unknown event:', webhookData.event);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send('Bad Request');
  }
});
```

### Event Handlers

```javascript
// License events
function onLicenseCreated(data) {
  console.log('License created:', data.id);
}

function onLicenseValidated(data) {
  console.log('License validated:', data.licenseKey);
}

function onLicenseExpired(data) {
  console.log('License expired:', data.id);
  // Send notification to user
}

// User events
function onUserCreated(data) {
  console.log('User created:', data.email);
}

// Payment events
function onPaymentCompleted(data) {
  console.log('Payment completed:', data.amount);
}
```

## 📊 Analytics Examples

### Basic Analytics

```javascript
// Get 30-day analytics
const analytics = await client.getAnalytics('30d');

console.log('Total Revenue:', analytics.totalRevenue);
console.log('Active Licenses:', analytics.activeLicenses);
console.log('Total Users:', analytics.totalUsers);
console.log('Conversion Rate:', analytics.conversionRate);
```

### License Analytics

```javascript
// Get license-specific analytics
const licenseAnalytics = await client.getLicenseAnalytics(licenseId, '7d');

console.log('Total Validations:', licenseAnalytics.usage.totalValidations);
console.log('Average per Day:', licenseAnalytics.usage.averagePerDay);
console.log('Peak Usage:', licenseAnalytics.usage.peakUsage);
```

### Custom Metrics

```javascript
// Get specific metrics
const customAnalytics = await client.getAnalytics('30d', [
  'revenue',
  'licenses',
  'users',
  'conversions'
]);
```

## 🛠️ Development

### Project Structure

```
src/
├── client.ts              # Main client class
├── license-validator.ts   # License validation logic
├── webhook-verifier.ts    # Webhook verification
├── types.ts              # TypeScript type definitions
├── exceptions.ts         # Custom exceptions
└── index.ts              # Main export file
```

### Building from Source

```bash
# Clone repository
git clone https://github.com/licensechain/nodejs-sdk.git
cd nodejs-sdk

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "LicenseValidator"
```

## 🚀 Deployment

### Production Configuration

```javascript
const client = new LicenseChainClient({
  apiKey: process.env.LICENSE_CHAIN_API_KEY,
  baseUrl: process.env.LICENSE_CHAIN_API_URL,
  timeout: parseInt(process.env.LICENSE_CHAIN_TIMEOUT) || 30000
});
```

### Docker Example

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Environment Setup

```bash
# Production environment
NODE_ENV=production
LICENSE_CHAIN_API_KEY=your_production_api_key
LICENSE_CHAIN_API_URL=https://api.licensechain.app
LICENSE_CHAIN_TIMEOUT=30000
LICENSE_CHAIN_WEBHOOK_SECRET=your_webhook_secret
```

## 🔒 Security

### API Key Security

- Store API keys in environment variables
- Never commit API keys to version control
- Use different keys for development and production
- Rotate keys regularly

### Webhook Security

- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Implement rate limiting
- Validate webhook data

### Request Security

- Use HTTPS for all API requests
- Implement proper error handling
- Validate all input data
- Use connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration
- Write comprehensive tests
- Document new features
- Follow conventional commits

## 📞 Support

- **Documentation**: [docs.licensechain.app](https://docs.licensechain.app)
- **Issues**: [GitHub Issues](https://github.com/licensechain/nodejs-sdk/issues)
- **Email**: support@licensechain.app
- **Discord**: [LicenseChain Community](https://discord.gg/licensechain)

## 📄 License

This project is licensed under the Elastic License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Node.js community for the amazing platform
- TypeScript team for the language
- LicenseChain team for the API
- All contributors and supporters

---

**LicenseChain Node.js SDK** - Empowering Node.js applications with license management 🔗

*Built with ❤️ by the LicenseChain Team*
