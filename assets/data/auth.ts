/**
 * Mock Auth Data
 * Used for testing authentication flows without backend API
 */

export interface MockUser {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: "tenant" | "property_owner" | "property_agent" | "relocation_driver" | "admin" | "super_admin";
  termsAcceptedAt?: string;
  termsVersion?: string;
}

export interface MockJWTPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: string;
  iat: number; // issued at
  exp: number; // expiration
}

export interface MockAuthResponse {
  user: MockUser;
  accessToken: string;
  refreshToken: string;
}

// ---------------------------------------------------------------------------
// Admin Credentials
// ---------------------------------------------------------------------------
export const ADMIN_EMAIL = "admin@speqlink.com";
export const SUPER_ADMIN_EMAIL = "superadmin@speqlink.com";
export const ADMIN_PASSWORD = "admin123"; // For testing only

export const MOCK_ADMIN_USER: MockUser = {
  id: "admin-001",
  email: ADMIN_EMAIL,
  name: "Admin User",
  role: "admin",
  termsAcceptedAt: new Date().toISOString(),
  termsVersion: "1.0",
};

export const MOCK_SUPER_ADMIN_USER: MockUser = {
  id: "super-admin-001",
  email: SUPER_ADMIN_EMAIL,
  name: "Super Admin",
  role: "super_admin",
  termsAcceptedAt: new Date().toISOString(),
  termsVersion: "1.0",
};

// ---------------------------------------------------------------------------
// OTP Codes
// ---------------------------------------------------------------------------
export const MOCK_OTP_CODE = "123456";
export const MOCK_RESET_TOKEN = "reset-token-12345";

// ---------------------------------------------------------------------------
// Mock Users
// ---------------------------------------------------------------------------
export const MOCK_USERS: Record<string, MockUser> = {
  "tenant@example.com": {
    id: "user-001",
    email: "tenant@masqany.com",
    phone: "+254712345678",
    name: "John Doe",
    role: "tenant",
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  },
  "+254712345678": {
    id: "user-001",
    email: "tenant@example.com",
    phone: "+254712345678",
    name: "John Doe",
    role: "tenant",
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  },
  "owner@example.com": {
    id: "user-002",
    email: "owner@example.com",
    phone: "+254723456789",
    name: "Jane Smith",
    role: "property_owner",
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  },
  "+254723456789": {
    id: "user-002",
    email: "owner@example.com",
    phone: "+254723456789",
    name: "Jane Smith",
    role: "property_owner",
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  },
  "agent@example.com": {
    id: "user-003",
    email: "agent@example.com",
    phone: "+254734567890",
    name: "Mike Johnson",
    role: "property_agent",
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  },
  "+254734567890": {
    id: "user-003",
    email: "agent@example.com",
    phone: "+254734567890",
    name: "Mike Johnson",
    role: "property_agent",
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  },
  "driver@example.com": {
    id: "user-004",
    email: "driver@example.com",
    phone: "+254745678901",
    name: "Sarah Williams",
    role: "relocation_driver",
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  },
  "+254745678901": {
    id: "user-004",
    email: "driver@example.com",
    phone: "+254745678901",
    name: "Sarah Williams",
    role: "relocation_driver",
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  },
  [ADMIN_EMAIL]: MOCK_ADMIN_USER,
  [SUPER_ADMIN_EMAIL]: MOCK_SUPER_ADMIN_USER,
};

// ---------------------------------------------------------------------------
// Mock Google User
// ---------------------------------------------------------------------------
export const MOCK_GOOGLE_USER: MockUser = {
  id: "google-user-001",
  email: "googleuser@gmail.com",
  name: "Google User",
  role: "tenant",
  termsAcceptedAt: new Date().toISOString(),
  termsVersion: "1.0",
};

// ---------------------------------------------------------------------------
// JWT Simulation
// ---------------------------------------------------------------------------
export function generateMockJWT(user: MockUser): string {
  const payload: MockJWTPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
  };

  // Simulate JWT structure (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadStr = btoa(JSON.stringify(payload));
  const signature = btoa(`mock-signature-${user.id}`);

  return `${header}.${payloadStr}.${signature}`;
}

export function decodeMockJWT(token: string): MockJWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload as MockJWTPayload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Mock Auth Responses
// ---------------------------------------------------------------------------
export function getMockAuthResponse(user: MockUser): MockAuthResponse {
  return {
    user,
    accessToken: generateMockJWT(user),
    refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
  };
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Simulate login with email/password
 */
export function mockLogin(identifier: string, password: string): MockAuthResponse | null {
  const user = MOCK_USERS[identifier.toLowerCase()];
  
  if (!user) {
    return null;
  }

  // Admin check
  if (identifier.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return getMockAuthResponse(MOCK_ADMIN_USER);
  }

  // Super Admin check
  if (identifier.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return getMockAuthResponse(MOCK_SUPER_ADMIN_USER);
  }

  // For testing, accept any password for non-admin users
  return getMockAuthResponse(user);
}

/**
 * Simulate OTP verification
 */
export function mockVerifyOTP(otp: string): boolean {
  return otp === MOCK_OTP_CODE;
}

/**
 * Simulate forgot password request
 */
export function mockForgotPassword(emailOrPhone: string): { success: boolean; message: string } {
  // Check if user exists
  const userExists = Object.values(MOCK_USERS).some(
    (u) => u.email === emailOrPhone || u.phone === emailOrPhone
  );

  if (!userExists) {
    return {
      success: false,
      message: "No account found with this email or phone number",
    };
  }

  return {
    success: true,
    message: `OTP sent to ${emailOrPhone}. Use code: ${MOCK_OTP_CODE}`,
  };
}

/**
 * Simulate password reset
 */
export function mockResetPassword(
  token: string,
  newPassword: string
): { success: boolean; message: string } {
  if (token !== MOCK_RESET_TOKEN) {
    return {
      success: false,
      message: "Invalid or expired reset token",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters",
    };
  }

  return {
    success: true,
    message: "Password reset successful",
  };
}

/**
 * Simulate Google OAuth login
 */
export function mockGoogleLogin(googleToken: string): MockAuthResponse {
  return getMockAuthResponse(MOCK_GOOGLE_USER);
}

/**
 * Simulate user registration
 */
export function mockRegister(
  email: string,
  phone: string,
  password: string,
  name: string,
  role: MockUser["role"]
): MockAuthResponse {
  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    email,
    phone,
    name,
    role,
    termsAcceptedAt: new Date().toISOString(),
    termsVersion: "1.0",
  };

  return getMockAuthResponse(newUser);
}
