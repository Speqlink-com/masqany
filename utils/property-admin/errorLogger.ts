/**
 * Property Admin - Error Logger
 * 
 * Centralized error logging for property admin module.
 * Logs errors to console and can be extended to send to monitoring services.
 */

import { Platform } from 'react-native';

interface ErrorContext {
  userId?: string;
  userRole?: string;
  feature?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface DeviceInfo {
  platform: string;
  version: string;
}

// Rate limiting: Track error counts per minute
const errorCounts: Map<string, { count: number; timestamp: number }> = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ERRORS_PER_WINDOW = 10;

/**
 * Get device information
 */
function getDeviceInfo(): DeviceInfo {
  return {
    platform: Platform.OS,
    version: Platform.Version.toString(),
  };
}

/**
 * Check if error should be logged (rate limiting)
 */
function shouldLogError(errorKey: string): boolean {
  const now = Date.now();
  const record = errorCounts.get(errorKey);

  if (!record) {
    errorCounts.set(errorKey, { count: 1, timestamp: now });
    return true;
  }

  // Reset if window has passed
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    errorCounts.set(errorKey, { count: 1, timestamp: now });
    return true;
  }

  // Check rate limit
  if (record.count >= MAX_ERRORS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Log API errors
 */
export function logApiError(
  error: any,
  endpoint: string,
  context?: ErrorContext
): void {
  const errorKey = `api:${endpoint}`;
  
  if (!shouldLogError(errorKey)) {
    return;
  }

  const deviceInfo = getDeviceInfo();
  const errorLog = {
    type: 'API_ERROR',
    endpoint,
    message: error?.message || 'Unknown error',
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    context: {
      ...context,
      userId: context?.userId ? `user_${context.userId.slice(0, 8)}` : undefined, // Anonymized
    },
    device: deviceInfo,
    timestamp: new Date().toISOString(),
  };

  console.error('[Property Admin - API Error]', errorLog);
  
  // TODO: Send to monitoring service (e.g., Sentry, LogRocket)
  // if (__DEV__) {
  //   // Development: just console
  // } else {
  //   // Production: send to monitoring service
  //   sendToMonitoringService(errorLog);
  // }
}

/**
 * Log validation errors
 */
export function logValidationError(
  field: string,
  value: any,
  expectedType: string,
  context?: ErrorContext
): void {
  const errorKey = `validation:${field}`;
  
  if (!shouldLogError(errorKey)) {
    return;
  }

  const deviceInfo = getDeviceInfo();
  const errorLog = {
    type: 'VALIDATION_ERROR',
    field,
    value: typeof value === 'object' ? JSON.stringify(value) : value,
    expectedType,
    context,
    device: deviceInfo,
    timestamp: new Date().toISOString(),
  };

  console.warn('[Property Admin - Validation Error]', errorLog);
  
  // TODO: Send to analytics for tracking validation issues
}

/**
 * Log state errors
 */
export function logStateError(
  stateName: string,
  error: any,
  context?: ErrorContext
): void {
  const errorKey = `state:${stateName}`;
  
  if (!shouldLogError(errorKey)) {
    return;
  }

  const deviceInfo = getDeviceInfo();
  const errorLog = {
    type: 'STATE_ERROR',
    stateName,
    message: error?.message || 'Unknown state error',
    stack: error?.stack,
    context,
    device: deviceInfo,
    timestamp: new Date().toISOString(),
  };

  console.error('[Property Admin - State Error]', errorLog);
  
  // TODO: Send to monitoring service
}

/**
 * Log analytics calculation errors
 */
export function logAnalyticsError(
  calculation: string,
  input: any,
  error: any,
  context?: ErrorContext
): void {
  const errorKey = `analytics:${calculation}`;
  
  if (!shouldLogError(errorKey)) {
    return;
  }

  const deviceInfo = getDeviceInfo();
  const errorLog = {
    type: 'ANALYTICS_ERROR',
    calculation,
    input: typeof input === 'object' ? JSON.stringify(input) : input,
    message: error?.message || 'Calculation failed',
    context,
    device: deviceInfo,
    timestamp: new Date().toISOString(),
  };

  console.error('[Property Admin - Analytics Error]', errorLog);
  
  // TODO: Send to monitoring service
}

/**
 * Log general errors
 */
export function logError(
  errorType: string,
  error: any,
  context?: ErrorContext
): void {
  const errorKey = `general:${errorType}`;
  
  if (!shouldLogError(errorKey)) {
    return;
  }

  const deviceInfo = getDeviceInfo();
  const errorLog = {
    type: errorType,
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    context,
    device: deviceInfo,
    timestamp: new Date().toISOString(),
  };

  console.error('[Property Admin - Error]', errorLog);
  
  // TODO: Send to monitoring service
}

/**
 * Clear rate limit cache (useful for testing)
 */
export function clearRateLimitCache(): void {
  errorCounts.clear();
}
