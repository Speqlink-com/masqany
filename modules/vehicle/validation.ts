/**
 * Vehicle Management Module - Validation Functions
 * 
 * This file contains all validation logic for vehicle registration and management.
 * Implements Kenyan standards for license plates and payment methods.
 */

import type {
    FormValidationResult,
    PaymentDetails,
    PaymentMethod,
    ValidationResult,
    VehicleRegistrationPayload,
} from "./types";

// ============================================================================
// Constants
// ============================================================================

export const KENYAN_PLATE_REGEX = /^[A-Z]{3}\s\d{3}[A-Z]$/;
export const MPESA_REGEX = /^\+254\d{9}$/;
export const MIN_CAPACITY = 50;
export const MAX_CAPACITY = 10000;
export const ALLOWED_DOCUMENT_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/heic"];
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
export const MIN_PHOTOS = 3;
export const MAX_PHOTOS = 10;

// ============================================================================
// License Plate Validation
// ============================================================================

/**
 * Validates Kenyan license plate format (e.g., KEA 100Q, KEB 211Z)
 * Pattern: 3 uppercase letters, space, 3 digits, 1 uppercase letter
 */
export function validatePlateNumber(plate: string): ValidationResult {
  const normalized = plate.trim().toUpperCase();
  
  if (!normalized) {
    return { isValid: false, error: "Plate number is required" };
  }
  
  if (!KENYAN_PLATE_REGEX.test(normalized)) {
    return {
      isValid: false,
      error: "Invalid plate format. Use format: KEA 100Q",
    };
  }
  
  return { isValid: true };
}

/**
 * Normalizes license plate input to uppercase with proper spacing
 */
export function normalizePlateNumber(plate: string): string {
  return plate.trim().toUpperCase();
}

// ============================================================================
// Capacity Validation
// ============================================================================

/**
 * Validates vehicle capacity within acceptable range (50-10000 kg)
 */
export function validateCapacity(
  capacity: number,
  unit: "kg" | "cubic_meters"
): ValidationResult {
  if (!capacity || capacity <= 0) {
    return { isValid: false, error: "Capacity is required" };
  }
  
  if (capacity < MIN_CAPACITY) {
    return {
      isValid: false,
      error: `Minimum capacity is ${MIN_CAPACITY} ${unit}`,
    };
  }
  
  if (capacity > MAX_CAPACITY) {
    return {
      isValid: false,
      error: `Maximum capacity is ${MAX_CAPACITY} ${unit}`,
    };
  }
  
  return { isValid: true };
}

// ============================================================================
// Document Validation
// ============================================================================

/**
 * Validates document file type and size
 */
export function validateDocument(file: {
  type: string;
  size: number;
}): ValidationResult {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Use JPEG, PNG, or PDF",
    };
  }
  
  if (file.size > MAX_DOCUMENT_SIZE) {
    return {
      isValid: false,
      error: "File too large. Maximum 10MB",
    };
  }
  
  return { isValid: true };
}

// ============================================================================
// Photo Validation
// ============================================================================

/**
 * Validates photo file type and size
 */
export function validatePhoto(file: {
  type: string;
  size: number;
}): ValidationResult {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Use JPEG, PNG, or HEIC",
    };
  }
  
  if (file.size > MAX_PHOTO_SIZE) {
    return {
      isValid: false,
      error: "Photo too large. Maximum 5MB",
    };
  }
  
  return { isValid: true };
}

/**
 * Validates photo count (3-10 photos required)
 */
export function validatePhotoCount(count: number): ValidationResult {
  if (count < MIN_PHOTOS) {
    return {
      isValid: false,
      error: `Minimum ${MIN_PHOTOS} photos required`,
    };
  }
  
  if (count > MAX_PHOTOS) {
    return {
      isValid: false,
      error: `Maximum ${MAX_PHOTOS} photos allowed`,
    };
  }
  
  return { isValid: true };
}

// ============================================================================
// Payment Method Validation
// ============================================================================

/**
 * Validates M-Pesa number format (+254XXXXXXXXX)
 */
export function validateMpesaNumber(number: string): ValidationResult {
  const normalized = number.trim();
  
  if (!normalized) {
    return { isValid: false, error: "M-Pesa number is required" };
  }
  
  if (!MPESA_REGEX.test(normalized)) {
    return {
      isValid: false,
      error: "Invalid M-Pesa format. Use +254XXXXXXXXX",
    };
  }
  
  return { isValid: true };
}

/**
 * Validates bank account details
 */
export function validateBankAccount(details: {
  bankName: string;
  accountNumber: string;
  accountName: string;
}): {
  isValid: boolean;
  errors?: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  if (!details.bankName?.trim()) {
    errors.bankName = "Bank name is required";
  }
  
  if (!details.accountNumber?.trim()) {
    errors.accountNumber = "Account number is required";
  } else if (!/^\d{10,16}$/.test(details.accountNumber)) {
    errors.accountNumber = "Invalid account number format";
  }
  
  if (!details.accountName?.trim()) {
    errors.accountName = "Account name is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * Validates payment details based on payment method
 */
export function validatePaymentDetails(
  method: PaymentMethod,
  details: PaymentDetails
): {
  isValid: boolean;
  errors?: Record<string, string>;
} {
  if (method === "mpesa") {
    if (!details.mpesaNumber) {
      return {
        isValid: false,
        errors: { mpesaNumber: "M-Pesa number is required" },
      };
    }
    const mpesaValidation = validateMpesaNumber(details.mpesaNumber);
    if (!mpesaValidation.isValid) {
      return {
        isValid: false,
        errors: { mpesaNumber: mpesaValidation.error! },
      };
    }
  } else if (method === "bank_transfer") {
    return validateBankAccount({
      bankName: details.bankName || "",
      accountNumber: details.accountNumber || "",
      accountName: details.accountName || "",
    });
  }
  
  return { isValid: true };
}

// ============================================================================
// Form Validation
// ============================================================================

/**
 * Validates complete vehicle registration form
 */
export function validateRegistrationForm(
  data: Partial<VehicleRegistrationPayload>
): FormValidationResult {
  const errors: Record<string, string> = {};
  
  // Driver name
  if (!data.driverName?.trim()) {
    errors.driverName = "Full legal name is required";
  }
  
  // Date of birth
  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  }
  
  // Gender
  if (!data.gender) {
    errors.gender = "Gender is required";
  }
  
  // Vehicle type
  if (!data.vehicleType) {
    errors.vehicleType = "Vehicle type is required";
  }
  
  // Plate number
  if (data.plateNumber) {
    const plateValidation = validatePlateNumber(data.plateNumber);
    if (!plateValidation.isValid) {
      errors.plateNumber = plateValidation.error!;
    }
  } else {
    errors.plateNumber = "Plate number is required";
  }
  
  // Capacity
  if (data.capacity && data.capacityUnit) {
    const capacityValidation = validateCapacity(data.capacity, data.capacityUnit);
    if (!capacityValidation.isValid) {
      errors.capacity = capacityValidation.error!;
    }
  } else {
    errors.capacity = "Capacity is required";
  }
  
  // National ID
  if (!data.nationalId?.trim()) {
    errors.nationalId = "National ID is required";
  }
  
  // Documents
  if (!data.insuranceDocument) {
    errors.insuranceDocument = "Insurance document is required";
  }
  
  if (!data.drivingLicense) {
    errors.drivingLicense = "Driving license is required";
  }
  
  // Photos
  if (!data.photos || data.photos.length < MIN_PHOTOS) {
    errors.photos = `Minimum ${MIN_PHOTOS} photos required`;
  } else if (data.photos.length > MAX_PHOTOS) {
    errors.photos = `Maximum ${MAX_PHOTOS} photos allowed`;
  }
  
  // Payment method
  if (!data.paymentMethod) {
    errors.paymentMethod = "Payment method is required";
  } else if (data.paymentDetails) {
    const paymentValidation = validatePaymentDetails(
      data.paymentMethod,
      data.paymentDetails
    );
    if (!paymentValidation.isValid && paymentValidation.errors) {
      Object.assign(errors, paymentValidation.errors);
    }
  }
  
  // Service zones
  if (!data.serviceZones || data.serviceZones.length === 0) {
    errors.serviceZones = "At least one service zone is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Checks if a date is within X days from now
 */
export function isWithinDays(dateString: string, days: number): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
}

/**
 * Checks if a date is expired
 */
export function isExpired(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

/**
 * Calculates days until expiration
 */
export function daysUntilExpiration(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
