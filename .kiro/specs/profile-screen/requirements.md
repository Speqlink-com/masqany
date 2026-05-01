# Requirements Document

## Introduction

The Profile Screen feature provides users with a centralized interface to view and manage their account settings, preferences, and profile information in the Masqany mobile app. This screen serves as the main hub for user personalization, security settings, language preferences, account management, and access to support resources.

The feature follows the app's two-layer state architecture (TanStack Query for server state, Zustand for client state) and the established module pattern with api.ts, hooks.ts, types.ts, and index.ts files.

## Glossary

- **Profile_Screen**: The main settings and privacy interface accessible from the profile tab
- **User_Profile_Module**: The feature module containing API bindings, hooks, and types for user profile operations
- **Settings_Card**: A rounded, styled card component displaying a setting option with icon, label, and navigation chevron
- **Avatar_Section**: The profile header displaying user avatar, name, and email
- **Auth_Store**: Zustand store managing authentication session and user data
- **Profile_API**: Backend API endpoints for user profile operations
- **Language_Preference**: User's selected interface language (English or Kiswahili)
- **Multi_Account_Manager**: System allowing users to switch between or add multiple accounts with different roles
- **Two_Factor_Authentication**: Optional security feature requiring secondary verification (2FA)

## Requirements

### Requirement 1: Profile Screen Layout

**User Story:** As a user, I want to see a well-organized profile screen with clear navigation and my account information, so that I can easily access settings and manage my profile.

#### Acceptance Criteria

1. THE Profile_Screen SHALL display a navigation button at the top left corner
2. THE Profile_Screen SHALL display "Settings and Privacy" as the center heading
3. THE Profile_Screen SHALL display the Avatar_Section below the heading
4. THE Profile_Screen SHALL display multiple Settings_Cards in a scrollable list
5. THE Profile_Screen SHALL use the background image from app-full-screen.webp
6. THE Profile_Screen SHALL use design tokens from constants/tokens.ts for all styling
7. THE Profile_Screen SHALL use NativeWind (Tailwind CSS) for component styling

### Requirement 2: Avatar Section Display

**User Story:** As a user, I want to see my profile picture, name, and email at the top of the profile screen, so that I can verify my account identity.

#### Acceptance Criteria

1. THE Avatar_Section SHALL display the user profile icon (user-profile-icon.webp)
2. THE Avatar_Section SHALL display an edit icon (edit.png) beside the avatar
3. THE Avatar_Section SHALL display the user's name below the avatar
4. THE Avatar_Section SHALL display the user's email below the name with different text weight
5. WHEN the user data is loading, THE Avatar_Section SHALL display a loading indicator
6. WHEN the user data fails to load, THE Avatar_Section SHALL display placeholder values

### Requirement 3: Settings Cards Display

**User Story:** As a user, I want to see organized setting options as cards, so that I can easily identify and access different settings categories.

#### Acceptance Criteria

1. THE Profile_Screen SHALL display at least five Settings_Cards
2. EACH Settings_Card SHALL have a rounded appearance with background color #e1e6e8
3. EACH Settings_Card SHALL display an icon on the left side
4. EACH Settings_Card SHALL display a descriptive label
5. EACH Settings_Card SHALL display a right chevron icon (right-chevron.png) on the right side
6. THE Settings_Cards SHALL include: Account Settings, Language Preferences, Security Settings, Terms and Policies, and Logout
7. THE Settings_Cards SHALL use appropriate icons: profile.webp for account, language.png for language, security.png for security, policies.png for policies, logout.png for logout

### Requirement 4: View Profile Information

**User Story:** As a user, I want to view my complete profile information, so that I can verify my account details are correct.

#### Acceptance Criteria

1. WHEN the Profile_Screen loads, THE User_Profile_Module SHALL fetch the current user data from the Profile_API
2. THE User_Profile_Module SHALL use TanStack Query for fetching and caching user profile data
3. THE Profile_Screen SHALL display the user's name from the Auth_Store
4. THE Profile_Screen SHALL display the user's email from the Auth_Store
5. THE Profile_Screen SHALL display the user's phone number if available
6. THE Profile_Screen SHALL display the user's avatar if available, otherwise use the default icon

### Requirement 5: Edit Profile Information

**User Story:** As a user, I want to edit my profile information including name, email, phone, and avatar, so that I can keep my account details up to date.

#### Acceptance Criteria

1. WHEN the user taps the edit icon in the Avatar_Section, THE Profile_Screen SHALL navigate to the edit profile screen
2. THE edit profile screen SHALL allow editing of the user's name
3. THE edit profile screen SHALL allow editing of the user's email
4. THE edit profile screen SHALL allow editing of the user's phone number
5. THE edit profile screen SHALL allow uploading a new avatar image
6. WHEN the user saves profile changes, THE User_Profile_Module SHALL send an update request to the Profile_API
7. WHEN the profile update succeeds, THE User_Profile_Module SHALL invalidate the user profile query cache
8. WHEN the profile update succeeds, THE Auth_Store SHALL update the user data
9. WHEN the profile update fails, THE Profile_Screen SHALL display an error message

### Requirement 6: Account Settings Access

**User Story:** As a user, I want to access account settings, so that I can manage my account preferences and information.

#### Acceptance Criteria

1. WHEN the user taps the Account Settings card, THE Profile_Screen SHALL navigate to the account settings screen
2. THE account settings screen SHALL display all editable profile fields
3. THE account settings screen SHALL display account status information (verified, host status)
4. THE account settings screen SHALL allow the user to view account creation date
5. THE account settings screen SHALL provide a way to return to the Profile_Screen

### Requirement 7: Language Preferences

**User Story:** As a user, I want to select my preferred language (English or Kiswahili), so that I can use the app in my preferred language.

#### Acceptance Criteria

1. WHEN the user taps the Language Preferences card, THE Profile_Screen SHALL navigate to the language selection screen
2. THE language selection screen SHALL display English as an option
3. THE language selection screen SHALL display Kiswahili as an option
4. THE language selection screen SHALL indicate the currently selected language
5. WHEN the user selects a language, THE User_Profile_Module SHALL save the Language_Preference
6. WHEN the language preference is saved, THE Profile_Screen SHALL update the interface language
7. THE User_Profile_Module SHALL persist the Language_Preference for future sessions

### Requirement 8: Security Settings

**User Story:** As a user, I want to access security settings to change my password and optionally enable two-factor authentication, so that I can keep my account secure.

#### Acceptance Criteria

1. WHEN the user taps the Security Settings card, THE Profile_Screen SHALL navigate to the security settings screen
2. THE security settings screen SHALL provide an option to change password
3. THE security settings screen SHALL provide an option to enable Two_Factor_Authentication
4. THE security settings screen SHALL provide an option to disable Two_Factor_Authentication if currently enabled
5. WHEN the user initiates a password change, THE security settings screen SHALL navigate to the change password flow
6. WHEN the password change succeeds, THE User_Profile_Module SHALL display a success message
7. WHEN Two_Factor_Authentication is enabled, THE security settings screen SHALL indicate the active status

### Requirement 9: Switch Account

**User Story:** As a user with multiple roles, I want to switch between my accounts, so that I can access different role-specific features without logging out.

#### Acceptance Criteria

1. WHERE the user has multiple accounts, THE Profile_Screen SHALL display a Switch Account option
2. WHEN the user taps Switch Account, THE Multi_Account_Manager SHALL display a list of available accounts
3. EACH account in the list SHALL display the account name and role
4. WHEN the user selects an account, THE Multi_Account_Manager SHALL switch to that account
5. WHEN the account switch succeeds, THE Auth_Store SHALL update with the new account data
6. WHEN the account switch succeeds, THE Profile_Screen SHALL refresh to display the new account information
7. WHERE the user has only one account, THE Profile_Screen SHALL NOT display the Switch Account option

### Requirement 10: Add Account

**User Story:** As a user, I want to add additional accounts to my profile, so that I can manage multiple roles or properties from one app installation.

#### Acceptance Criteria

1. WHEN the user taps Add Account, THE Profile_Screen SHALL navigate to the add account screen
2. THE add account screen SHALL allow the user to log in with different credentials
3. WHEN the new account login succeeds, THE Multi_Account_Manager SHALL add the account to the user's account list
4. WHEN the new account is added, THE Multi_Account_Manager SHALL switch to the newly added account
5. THE Multi_Account_Manager SHALL persist all added accounts for future sessions
6. THE Multi_Account_Manager SHALL allow up to five accounts per device

### Requirement 11: Logout

**User Story:** As a user, I want to log out of my account, so that I can secure my account when I'm done using the app.

#### Acceptance Criteria

1. WHEN the user taps the Logout card, THE Profile_Screen SHALL display a confirmation dialog
2. THE confirmation dialog SHALL ask "Are you sure you want to log out?"
3. THE confirmation dialog SHALL provide Cancel and Logout buttons
4. WHEN the user confirms logout, THE User_Profile_Module SHALL call the logout endpoint
5. WHEN the logout succeeds, THE Auth_Store SHALL clear all session data
6. WHEN the logout succeeds, THE User_Profile_Module SHALL clear all cached query data
7. WHEN the logout succeeds, THE Profile_Screen SHALL navigate to the authentication screen
8. WHEN the logout fails, THE Profile_Screen SHALL display an error message and remain on the current screen

### Requirement 12: Terms and Policies Viewer

**User Story:** As a user, I want to view the app's terms of service and privacy policies, so that I can understand how my data is used and what rules govern the platform.

#### Acceptance Criteria

1. WHEN the user taps the Terms and Policies card, THE Profile_Screen SHALL navigate to the policies viewer screen
2. THE policies viewer screen SHALL display a list of available policy documents
3. THE policies viewer screen SHALL include Terms of Service as an option
4. THE policies viewer screen SHALL include Privacy Policy as an option
5. WHEN the user selects a policy document, THE policies viewer screen SHALL display the full policy text
6. THE policies viewer screen SHALL allow scrolling through long policy documents
7. THE policies viewer screen SHALL provide a way to return to the Profile_Screen

### Requirement 13: Support Access

**User Story:** As a user, I want to access support resources, so that I can get help when I encounter issues or have questions.

#### Acceptance Criteria

1. THE Profile_Screen SHALL display a Support option in the Settings_Cards
2. THE Support card SHALL use the support.png icon
3. WHEN the user taps the Support card, THE Profile_Screen SHALL navigate to the support screen
4. THE support screen SHALL provide contact information for customer support
5. THE support screen SHALL provide a way to submit a support ticket
6. THE support screen SHALL display frequently asked questions (FAQ)
7. THE support screen SHALL provide a way to return to the Profile_Screen

### Requirement 14: Notification Preferences

**User Story:** As a user, I want to manage my notification preferences, so that I can control what notifications I receive from the app.

#### Acceptance Criteria

1. THE Profile_Screen SHALL display a Notifications option in the Settings_Cards
2. THE Notifications card SHALL use the notificattion-icon.webp icon
3. WHEN the user taps the Notifications card, THE Profile_Screen SHALL navigate to the notification preferences screen
4. THE notification preferences screen SHALL allow enabling or disabling push notifications
5. THE notification preferences screen SHALL allow enabling or disabling email notifications
6. THE notification preferences screen SHALL allow enabling or disabling booking notifications
7. THE notification preferences screen SHALL allow enabling or disabling chat notifications
8. THE notification preferences screen SHALL allow enabling or disabling promotional notifications
9. WHEN the user changes a notification preference, THE User_Profile_Module SHALL save the preference to the Profile_API
10. WHEN the preference save succeeds, THE notification preferences screen SHALL display a confirmation

### Requirement 15: Profile Module Architecture

**User Story:** As a developer, I want the profile feature to follow the established module pattern, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE User_Profile_Module SHALL be located in modules/profile/
2. THE User_Profile_Module SHALL contain api.ts for all API calls
3. THE User_Profile_Module SHALL contain hooks.ts for all TanStack Query hooks
4. THE User_Profile_Module SHALL contain types.ts for all TypeScript interfaces
5. THE User_Profile_Module SHALL contain index.ts that re-exports all public APIs
6. THE Profile_Screen SHALL NOT call apiClient directly
7. THE Profile_Screen SHALL only use hooks from User_Profile_Module for data access
8. THE User_Profile_Module SHALL use the single Axios instance from lib/api/client.ts
9. THE User_Profile_Module SHALL define query keys as const arrays in hooks.ts
10. THE User_Profile_Module SHALL use TanStack Query for all server state management
11. THE User_Profile_Module SHALL use Auth_Store for client state management
