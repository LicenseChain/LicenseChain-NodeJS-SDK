# LicenseChain Node.js SDK

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-blue.svg)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/licensechain-sdk)](https://www.npmjs.com/package/licensechain-sdk)

Official Node.js SDK for LicenseChain - Secure license management for Node.js applications.

## 🚀 Features

- **🔐 Secure Authentication** - User registration, login, and session management
- **📜 License Management** - Create, validate, update, and revoke licenses
- **🛡️ Hardware ID Validation** - Prevent license sharing and unauthorized access
- **🔔 Webhook Support** - Real-time license events and notifications
- **📊 Analytics Integration** - Track license usage and performance metrics
- **⚡ High Performance** - Optimized for production workloads
- **🔄 Async Operations** - Non-blocking HTTP requests and data processing
- **🛠️ Easy Integration** - Simple API with comprehensive documentation

## 📦 Installation

### Method 1: npm (Recommended)

```bash
# Install via npm
npm install licensechain-sdk

# Or via yarn
yarn add licensechain-sdk
```

### Method 2: pnpm

```bash
# Install via pnpm
pnpm add licensechain-sdk
```

### Method 3: Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/LicenseChain/LicenseChain-NodeJS-SDK/releases)
2. Extract to your project directory
3. Install dependencies

## 🚀 Quick Start

### Basic Setup

```typescript
import LicenseChain from 'licensechain-sdk';

// Initialize the client
const client = new LicenseChain({
  apiKey: 'your-api-key',
  appName: 'your-app-name',
  version: '1.0.0'
});

// Connect to LicenseChain
try {
  await client.connect();
  console.log('Connected to LicenseChain successfully!');
} catch (error) {
  console.error('Failed to connect:', error.message);
}
```

### User Authentication

```typescript
// Register a new user
try {
  const user = await client.register('username', 'password', 'email@example.com');
  console.log('User registered successfully!');
  console.log('User ID:', user.id);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login existing user
try {
  const user = await client.login('username', 'password');
  console.log('User logged in successfully!');
  console.log('Session ID:', user.sessionId);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### License Management

```typescript
// Validate a license
try {
  const license = await client.validateLicense('LICENSE-KEY-HERE');
  console.log('License is valid!');
  console.log('License Key:', license.key);
  console.log('Status:', license.status);
  console.log('Expires:', license.expires);
  console.log('Features:', license.features.join(', '));
  console.log('User:', license.user);
} catch (error) {
  console.error('License validation failed:', error.message);
}

// Get user's licenses
try {
  const licenses = await client.getUserLicenses();
  console.log(`Found ${licenses.length} licenses:`);
  licenses.forEach((license, index) => {
    console.log(`  ${index + 1}. ${license.key} - ${license.status} (Expires: ${license.expires})`);
  });
} catch (error) {
  console.error('Failed to get licenses:', error.message);
}
```

### Hardware ID Validation

```typescript
// Get hardware ID (automatically generated)
const hardwareId = client.getHardwareId();
console.log('Hardware ID:', hardwareId);

// Validate hardware ID with license
try {
  const isValid = await client.validateHardwareId('LICENSE-KEY-HERE', hardwareId);
  if (isValid) {
    console.log('Hardware ID is valid for this license!');
  } else {
    console.log('Hardware ID is not valid for this license.');
  }
} catch (error) {
  console.error('Hardware ID validation failed:', error.message);
}
```

### Webhook Integration

```typescript
// Set up webhook handler
client.setWebhookHandler((event, data) => {
  console.log('Webhook received:', event);
  
  switch (event) {
    case 'license.created':
      console.log('New license created:', data.licenseKey);
      break;
    case 'license.updated':
      console.log('License updated:', data.licenseKey);
      break;
    case 'license.revoked':
      console.log('License revoked:', data.licenseKey);
      break;
  }
});

// Start webhook listener
await client.startWebhookListener();
```

## 📚 API Reference

### LicenseChain Client

#### Constructor

```typescript
const client = new LicenseChain({
  apiKey: 'your-api-key',
  appName: 'your-app-name',
  version: '1.0.0',
  baseUrl: 'https://api.licensechain.app' // Optional
});
```

#### Methods

##### Connection Management

```typescript
// Connect to LicenseChain
await client.connect();

// Disconnect from LicenseChain
await client.disconnect();

// Check connection status
const isConnected = client.isConnected();
```

##### User Authentication

```typescript
// Register a new user
const user = await client.register(username, password, email);

// Login existing user
const user = await client.login(username, password);

// Logout current user
await client.logout();

// Get current user info
const user = await client.getCurrentUser();
```

##### License Management

```typescript
// Validate a license
const license = await client.validateLicense(licenseKey);

// Get user's licenses
const licenses = await client.getUserLicenses();

// Create a new license
const license = await client.createLicense(userId, features, expires);

// Update a license
const license = await client.updateLicense(licenseKey, updates);

// Revoke a license
await client.revokeLicense(licenseKey);

// Extend a license
const license = await client.extendLicense(licenseKey, days);
```

##### Hardware ID Management

```typescript
// Get hardware ID
const hardwareId = client.getHardwareId();

// Validate hardware ID
const isValid = await client.validateHardwareId(licenseKey, hardwareId);

// Bind hardware ID to license
await client.bindHardwareId(licenseKey, hardwareId);
```

##### Webhook Management

```typescript
// Set webhook handler
client.setWebhookHandler(handler);

// Start webhook listener
await client.startWebhookListener();

// Stop webhook listener
await client.stopWebhookListener();
```

##### Analytics

```typescript
// Track event
await client.trackEvent(eventName, properties);

// Get analytics data
const analytics = await client.getAnalytics(timeRange);
```

## 🔧 Configuration

### Environment Variables

Set these in your environment or through your build process:

```bash
# Required
export LICENSECHAIN_API_KEY=your-api-key
export LICENSECHAIN_APP_NAME=your-app-name
export LICENSECHAIN_APP_VERSION=1.0.0

# Optional
export LICENSECHAIN_BASE_URL=https://api.licensechain.app
export LICENSECHAIN_DEBUG=true
```

### Advanced Configuration

```typescript
const client = new LicenseChain({
  apiKey: 'your-api-key',
  appName: 'your-app-name',
  version: '1.0.0',
  baseUrl: 'https://api.licensechain.app',
  timeout: 30000,        // Request timeout in milliseconds
  retries: 3,            // Number of retry attempts
  debug: false,          // Enable debug logging
  userAgent: 'MyApp/1.0.0' // Custom user agent
});
```

## 🛡️ Security Features

### Hardware ID Protection

The SDK automatically generates and manages hardware IDs to prevent license sharing:

```typescript
// Hardware ID is automatically generated and stored
const hardwareId = client.getHardwareId();

// Validate against license
const isValid = await client.validateHardwareId(licenseKey, hardwareId);
```

### Secure Communication

- All API requests use HTTPS
- API keys are securely stored and transmitted
- Session tokens are automatically managed
- Webhook signatures are verified

### License Validation

- Real-time license validation
- Hardware ID binding
- Expiration checking
- Feature-based access control

## 📊 Analytics and Monitoring

### Event Tracking

```typescript
// Track custom events
await client.trackEvent('app.started', {
  level: 1,
  playerCount: 10
});

// Track license events
await client.trackEvent('license.validated', {
  licenseKey: 'LICENSE-KEY',
  features: 'premium,unlimited'
});
```

### Performance Monitoring

```typescript
// Get performance metrics
const metrics = await client.getPerformanceMetrics();
console.log('API Response Time:', metrics.averageResponseTime + 'ms');
console.log('Success Rate:', (metrics.successRate * 100).toFixed(2) + '%');
console.log('Error Count:', metrics.errorCount);
```

## 🔄 Error Handling

### Custom Error Types

```typescript
try {
  const license = await client.validateLicense('invalid-key');
} catch (error) {
  if (error instanceof LicenseChainError) {
    switch (error.type) {
      case 'INVALID_LICENSE':
        console.error('License key is invalid');
        break;
      case 'EXPIRED_LICENSE':
        console.error('License has expired');
        break;
      case 'NETWORK_ERROR':
        console.error('Network connection failed');
        break;
      default:
        console.error('LicenseChain error:', error.message);
    }
  }
}
```

### Retry Logic

```typescript
// Automatic retry for network errors
const client = new LicenseChain({
  apiKey: 'your-api-key',
  appName: 'your-app-name',
  version: '1.0.0',
  retries: 3,            // Retry up to 3 times
  timeout: 30000         // Wait 30 seconds for each request
});
```

## 🧪 Testing

### Unit Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Integration Tests

```bash
# Test with real API
npm run test:integration
```

## 📝 Examples

See the `examples/` directory for complete examples:

- `basic-usage.js` - Basic SDK usage
- `advanced-features.js` - Advanced features and configuration
- `webhook-integration.js` - Webhook handling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install Node.js 16 or later
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Test: `npm test`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://docs.licensechain.app/nodejs](https://docs.licensechain.app/nodejs)
- **Issues**: [GitHub Issues](https://github.com/LicenseChain/LicenseChain-NodeJS-SDK/issues)
- **Discord**: [LicenseChain Discord](https://discord.gg/licensechain)
- **Email**: support@licensechain.app

## 🔗 Related Projects

- [LicenseChain JavaScript SDK](https://github.com/LicenseChain/LicenseChain-JavaScript-SDK)
- [LicenseChain Python SDK](https://github.com/LicenseChain/LicenseChain-Python-SDK)
- [LicenseChain Customer Panel](https://github.com/LicenseChain/LicenseChain-Customer-Panel)

---

**Made with ❤️ for the Node.js community**
