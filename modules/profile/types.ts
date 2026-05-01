// Profile module types
// This file contains TypeScript interfaces for the profile domain

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isHost: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Extended profile fields
  language: LanguageCode;
  notificationPreferences: NotificationPreferences;
  securitySettings: SecuritySettings;
}

export type LanguageCode = "en" | "sw"; // English, Kiswahili

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  bookingNotifications: boolean;
  chatNotifications: boolean;
  promotionalNotifications: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: "sms" | "email" | "authenticator";
  lastPasswordChange?: string;
}

export interface ProfileUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string; // Base64 or URL
}

export interface LanguageUpdatePayload {
  language: LanguageCode;
}

export interface NotificationUpdatePayload {
  preferences: Partial<NotificationPreferences>;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorTogglePayload {
  enabled: boolean;
  method?: "sms" | "email" | "authenticator";
  verificationCode?: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  role: "guest" | "host" | "admin";
  avatar?: string;
}

export interface MultiAccountState {
  accounts: Account[];
  activeAccountId: string;
}
