/**
 * Property Admin - HTTP Error Handler
 * 
 * Handles specific HTTP error codes with appropriate user messages and actions.
 */

import { Alert } from 'react-native';
import { logApiError } from './errorLogger';

export interface HttpError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    statusText?: string;
    data?: any;
  };
}

export interface ErrorHandlerOptions {
  endpoint: string;
  onUnauthorized?: () => void; // Callback for 401 (e.g., clear auth and redirect to login)
  onRetry?: () => void; // Callback for retryable errors
  context?: Record<string, any>;
}

/**
 * Get user-friendly error message based on HTTP status code
 */
export function getErrorMessage(error: HttpError): string {
  const status = error?.response?.status || error?.status;

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'Access denied. You don\'t have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 422:
      // Try to extract field-specific errors from response
      const validationErrors = error?.response?.data?.errors;
      if (validationErrors && typeof validationErrors === 'object') {
        const firstError = Object.values(validationErrors)[0];
        return Array.isArray(firstError) ? firstError[0] : 'Validation error. Please check your input.';
      }
      return 'Validation error. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Something went wrong on our end. Please try again later.';
    case 502:
    case 503:
      return 'Service temporarily unavailable. We\'ll retry automatically.';
    case 504:
      return 'Request timeout. Please check your connection and try again.';
    default:
      return error?.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Handle HTTP errors with appropriate actions
 */
export function handleHttpError(
  error: HttpError,
  options: ErrorHandlerOptions
): void {
  const status = error?.response?.status || error?.status;
  const message = getErrorMessage(error);

  // Log the error
  logApiError(error, options.endpoint, options.context);

  switch (status) {
    case 401:
      // Unauthorized: Clear auth tokens and redirect to login
      Alert.alert(
        'Session Expired',
        message,
        [
          {
            text: 'Sign In',
            onPress: () => {
              if (options.onUnauthorized) {
                options.onUnauthorized();
              }
            },
          },
        ]
      );
      break;

    case 403:
      // Forbidden: Show access denied message
      Alert.alert('Access Denied', message, [{ text: 'OK' }]);
      break;

    case 404:
      // Not Found: Show specific message
      const resourceType = options.endpoint.includes('property') ? 'Property' : 'Resource';
      Alert.alert(
        `${resourceType} Not Found`,
        `The ${resourceType.toLowerCase()} you're looking for doesn't exist or has been removed.`,
        [{ text: 'OK' }]
      );
      break;

    case 422:
      // Validation Error: Show field-specific errors
      Alert.alert('Validation Error', message, [{ text: 'OK' }]);
      break;

    case 429:
      // Rate Limit: Show rate limit message
      Alert.alert('Too Many Requests', message, [{ text: 'OK' }]);
      break;

    case 500:
      // Server Error: Show error with retry option
      Alert.alert(
        'Server Error',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Retry',
            onPress: () => {
              if (options.onRetry) {
                options.onRetry();
              }
            },
          },
        ]
      );
      break;

    case 502:
    case 503:
      // Service Unavailable: Auto-retry after delay
      console.log('[HTTP Error] Service unavailable, will auto-retry');
      setTimeout(() => {
        if (options.onRetry) {
          options.onRetry();
        }
      }, 3000); // Retry after 3 seconds
      break;

    case 504:
      // Gateway Timeout: Show timeout message with retry
      Alert.alert(
        'Request Timeout',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Retry',
            onPress: () => {
              if (options.onRetry) {
                options.onRetry();
              }
            },
          },
        ]
      );
      break;

    default:
      // Generic error: Show message with retry option
      Alert.alert(
        'Error',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Retry',
            onPress: () => {
              if (options.onRetry) {
                options.onRetry();
              }
            },
          },
        ]
      );
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: HttpError): boolean {
  const status = error?.response?.status || error?.status;
  return status === 502 || status === 503 || status === 504 || status === 429;
}

/**
 * Get retry delay based on error type
 */
export function getRetryDelay(error: HttpError): number {
  const status = error?.response?.status || error?.status;
  
  switch (status) {
    case 429: // Rate limit
      return 5000; // 5 seconds
    case 502:
    case 503:
      return 3000; // 3 seconds
    case 504:
      return 2000; // 2 seconds
    default:
      return 1000; // 1 second
  }
}
