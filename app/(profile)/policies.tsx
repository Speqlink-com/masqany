/**
 * Policies Viewer Screen
 * Displays list of policy documents (Terms of Service, Privacy Policy, Community Guidelines)
 * Each policy opens in a modal with full text
 * Uses NativeWind (Tailwind CSS) for styling
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7
 */
import { colors, spacing, typography } from "@/constants/tokens";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ImageBackground,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PolicyDocument {
  id: string;
  title: string;
  icon: string;
  content: string;
  lastUpdated: string;
}

const POLICIES: PolicyDocument[] = [
  {
    id: "terms",
    title: "Terms of Service",
    icon: "📄",
    lastUpdated: "January 15, 2024",
    content: `MASQANY TERMS OF SERVICE

Last Updated: January 15, 2024

1. ACCEPTANCE OF TERMS

By accessing and using the Masqany mobile application ("App"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the App.

2. DESCRIPTION OF SERVICE

Masqany provides a platform connecting property owners (Hosts) with individuals seeking short-term accommodations (Guests). The App facilitates bookings, payments, and communication between Hosts and Guests.

3. USER ACCOUNTS

3.1 Registration: You must register for an account to use certain features of the App. You agree to provide accurate, current, and complete information during registration.

3.2 Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

3.3 Account Types: Users may register as Guests, Hosts, or both. Different terms may apply to each account type.

4. HOST RESPONSIBILITIES

4.1 Property Listings: Hosts must provide accurate descriptions, photos, and availability information for their properties.

4.2 Legal Compliance: Hosts must comply with all applicable laws, regulations, and tax obligations related to their property listings.

4.3 Guest Safety: Hosts are responsible for ensuring their properties meet safety standards and local regulations.

5. GUEST RESPONSIBILITIES

5.1 Booking Accuracy: Guests must provide accurate information when making bookings, including the number of guests and intended use of the property.

5.2 Property Care: Guests agree to treat Host properties with respect and care, leaving them in the same condition as found.

5.3 House Rules: Guests must comply with all house rules specified by the Host.

6. PAYMENTS AND FEES

6.1 Service Fees: Masqany charges service fees for facilitating bookings. These fees are clearly disclosed before booking confirmation.

6.2 Payment Processing: All payments are processed securely through our payment partners. Masqany does not store full payment card details.

6.3 Cancellations and Refunds: Cancellation policies vary by property. Refund eligibility is determined by the Host's cancellation policy.

7. PROHIBITED CONDUCT

Users may not:
- Violate any laws or regulations
- Infringe on intellectual property rights
- Transmit harmful or malicious code
- Harass, abuse, or harm other users
- Use the App for fraudulent purposes
- Create multiple accounts to circumvent restrictions

8. INTELLECTUAL PROPERTY

All content, trademarks, and data on the App, including but not limited to software, databases, text, graphics, icons, and hyperlinks, are the property of Masqany or its licensors.

9. LIMITATION OF LIABILITY

Masqany is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the App. Our total liability shall not exceed the amount paid by you to Masqany in the twelve months preceding the claim.

10. DISPUTE RESOLUTION

Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the laws of Kenya.

11. MODIFICATIONS TO TERMS

Masqany reserves the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the modified Terms.

12. TERMINATION

Masqany may terminate or suspend your account at any time for violation of these Terms or for any other reason at our sole discretion.

13. CONTACT INFORMATION

For questions about these Terms, please contact us at:
Email: legal@masqany.com
Phone: +254 700 000 000

By using Masqany, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: "🔒",
    lastUpdated: "January 15, 2024",
    content: `MASQANY PRIVACY POLICY

Last Updated: January 15, 2024

1. INTRODUCTION

Masqany ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.

2. INFORMATION WE COLLECT

2.1 Personal Information
- Name, email address, phone number
- Profile photo
- Payment information (processed securely by third-party providers)
- Government-issued ID (for Host verification)

2.2 Property Information (for Hosts)
- Property address and details
- Photos and descriptions
- Availability and pricing

2.3 Booking Information
- Booking dates and guest count
- Communication between Hosts and Guests
- Reviews and ratings

2.4 Automatically Collected Information
- Device information (model, operating system)
- IP address and location data
- App usage analytics
- Cookies and similar technologies

3. HOW WE USE YOUR INFORMATION

We use collected information to:
- Facilitate bookings and payments
- Verify user identities
- Provide customer support
- Send booking confirmations and updates
- Improve our services
- Prevent fraud and ensure security
- Comply with legal obligations
- Send marketing communications (with your consent)

4. INFORMATION SHARING

We may share your information with:

4.1 Other Users
- Hosts and Guests share necessary information to facilitate bookings
- Profile information is visible to other users

4.2 Service Providers
- Payment processors
- Identity verification services
- Cloud hosting providers
- Analytics services

4.3 Legal Requirements
- When required by law or legal process
- To protect our rights and safety
- In connection with business transfers

5. DATA SECURITY

We implement appropriate technical and organizational measures to protect your information, including:
- Encryption of data in transit and at rest
- Regular security assessments
- Access controls and authentication
- Secure payment processing

However, no method of transmission over the internet is 100% secure.

6. YOUR RIGHTS

You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt-out of marketing communications
- Withdraw consent for data processing
- Export your data

To exercise these rights, contact us at privacy@masqany.com.

7. DATA RETENTION

We retain your information for as long as necessary to provide our services and comply with legal obligations. Deleted accounts are permanently removed within 90 days.

8. CHILDREN'S PRIVACY

Our App is not intended for users under 18 years of age. We do not knowingly collect information from children.

9. INTERNATIONAL DATA TRANSFERS

Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.

10. COOKIES AND TRACKING

We use cookies and similar technologies to:
- Remember your preferences
- Analyze app usage
- Provide personalized content
- Improve security

You can manage cookie preferences in your device settings.

11. THIRD-PARTY LINKS

Our App may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.

12. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. We will notify you of significant changes via email or app notification.

13. CONTACT US

For questions about this Privacy Policy or our data practices, contact us at:
Email: privacy@masqany.com
Phone: +254 700 000 000
Address: Masqany Ltd, Nairobi, Kenya

14. DATA PROTECTION OFFICER

For data protection inquiries, contact our Data Protection Officer at:
Email: dpo@masqany.com

By using Masqany, you consent to the collection and use of information as described in this Privacy Policy.`,
  },
  {
    id: "community",
    title: "Community Guidelines",
    icon: "👥",
    lastUpdated: "January 15, 2024",
    content: `MASQANY COMMUNITY GUIDELINES

Last Updated: January 15, 2024

Welcome to the Masqany community! These guidelines help ensure a safe, respectful, and enjoyable experience for all users.

1. RESPECT AND COURTESY

1.1 Treat Everyone with Respect
- Be polite and considerate in all communications
- Respect cultural differences and diverse backgrounds
- Use appropriate language

1.2 No Discrimination
- Do not discriminate based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic
- All users deserve equal treatment and opportunity

2. HONEST AND ACCURATE INFORMATION

2.1 For Hosts
- Provide accurate property descriptions and photos
- Be transparent about amenities and house rules
- Update availability calendars promptly
- Disclose any property issues or limitations

2.2 For Guests
- Provide accurate guest counts and booking details
- Be honest about your intended use of the property
- Communicate any special needs or requirements

3. SAFETY AND SECURITY

3.1 Property Safety
- Hosts must ensure properties meet safety standards
- Report any safety hazards immediately
- Provide emergency contact information

3.2 Personal Safety
- Meet in public places when necessary
- Trust your instincts
- Report suspicious behavior
- Do not share sensitive personal information unnecessarily

4. COMMUNICATION

4.1 Timely Responses
- Respond to messages within 24 hours
- Keep communication channels open
- Use the in-app messaging system for booking-related discussions

4.2 Professional Communication
- Keep conversations relevant to bookings
- Do not spam or send unsolicited messages
- Respect privacy and boundaries

5. PROPERTY CARE

5.1 Guest Responsibilities
- Treat properties with care and respect
- Follow house rules
- Report any damages immediately
- Leave properties clean and tidy

5.2 Host Responsibilities
- Provide clean, well-maintained properties
- Address maintenance issues promptly
- Respect guest privacy during their stay

6. REVIEWS AND RATINGS

6.1 Honest Reviews
- Provide truthful, constructive feedback
- Base reviews on actual experiences
- Avoid personal attacks or offensive language

6.2 Review Integrity
- Do not manipulate ratings or reviews
- Do not offer incentives for positive reviews
- Report fake or fraudulent reviews

7. PROHIBITED ACTIVITIES

The following activities are strictly prohibited:

7.1 Illegal Activities
- Using properties for illegal purposes
- Violating local laws or regulations
- Facilitating criminal activity

7.2 Fraudulent Behavior
- Creating fake accounts or listings
- Providing false information
- Payment fraud or chargebacks abuse

7.3 Harassment and Abuse
- Threatening or intimidating behavior
- Sexual harassment
- Stalking or unwanted contact

7.4 Property Misuse
- Unauthorized parties or events
- Exceeding guest capacity
- Smoking in non-smoking properties
- Bringing unauthorized pets

8. CONFLICT RESOLUTION

8.1 Direct Communication
- Try to resolve issues directly with the other party first
- Be open to compromise and understanding

8.2 Masqany Support
- Contact our support team for assistance with disputes
- Provide documentation and evidence when reporting issues
- Cooperate with resolution processes

9. PRIVACY AND DATA PROTECTION

- Respect the privacy of other users
- Do not share others' personal information without consent
- Use personal information only for booking purposes

10. INTELLECTUAL PROPERTY

- Do not use copyrighted images or content without permission
- Respect trademarks and brand identities
- Report copyright violations

11. CONSEQUENCES OF VIOLATIONS

Violations of these guidelines may result in:
- Warning notifications
- Temporary account suspension
- Permanent account termination
- Legal action in severe cases

12. REPORTING VIOLATIONS

If you witness or experience violations of these guidelines:
- Use the in-app reporting feature
- Contact support@masqany.com
- Provide detailed information and evidence

13. CONTINUOUS IMPROVEMENT

We regularly review and update these guidelines based on:
- Community feedback
- Emerging issues
- Legal requirements
- Best practices

14. ACKNOWLEDGMENT

By using Masqany, you agree to follow these Community Guidelines and help create a positive experience for all users.

Thank you for being part of the Masqany community!

For questions or concerns, contact us at:
Email: community@masqany.com
Phone: +254 700 000 000`,
  },
];

export default function PoliciesScreen() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Handle policy card press
  const handlePolicyPress = (policy: PolicyDocument) => {
    setSelectedPolicy(policy);
    setModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalVisible(false);
    // Delay clearing selected policy to allow modal animation to complete
    setTimeout(() => setSelectedPolicy(null), 300);
  };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {/* Header */}
          <View className="px-5 py-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "#85C9FF" }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 20, color: colors.dark[400] }}>←</Text>
            </TouchableOpacity>
            <Text
              className="flex-1 text-center font-poppins-semibold"
              style={{ fontSize: typography.size.lg, color: colors.dark[400] }}
            >
              Terms & Policies
            </Text>
            <View className="w-10" />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-5 py-6">
              {/* Description */}
              <Text
                className="font-inter-regular mb-6"
                style={{ fontSize: typography.size.base, color: colors.dark[100] }}
              >
                Review our policies to understand how Masqany works and how we protect your information.
              </Text>

              {/* Policy Cards */}
              {POLICIES.map((policy) => (
                <TouchableOpacity
                  key={policy.id}
                  onPress={() => handlePolicyPress(policy)}
                  activeOpacity={0.7}
                  className="bg-white rounded-lg p-4 mb-3"
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: colors.primary[50] }}
                    >
                      <Text style={{ fontSize: 24 }}>{policy.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-inter-semibold mb-1"
                        style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                      >
                        {policy.title}
                      </Text>
                      <Text
                        className="font-inter-regular"
                        style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                      >
                        Last updated: {policy.lastUpdated}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: colors.dark[100] }}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Info Note */}
              <View
                className="rounded-lg p-4 mt-3"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Text
                  className="font-inter-regular"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  💡 By using Masqany, you agree to our Terms of Service and Privacy Policy. We recommend reviewing these documents regularly as they may be updated from time to time.
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>

      {/* Policy Viewer Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
          {/* Modal Header */}
          <View
            className="px-5 py-4 flex-row items-center"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.light[200] }}
          >
            <TouchableOpacity
              onPress={handleCloseModal}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.light[300] }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 20, color: colors.dark[400] }}>✕</Text>
            </TouchableOpacity>
            <Text
              className="flex-1 text-center font-poppins-semibold"
              style={{ fontSize: typography.size.lg, color: colors.dark[400] }}
            >
              {selectedPolicy?.title}
            </Text>
            <View className="w-10" />
          </View>

          {/* Policy Content */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: spacing.lg }}
            showsVerticalScrollIndicator={true}
          >
            {selectedPolicy && (
              <>
                {/* Last Updated */}
                <View
                  className="rounded-lg p-3 mb-4"
                  style={{ backgroundColor: colors.light[300] }}
                >
                  <Text
                    className="font-inter-regular"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Last updated: {selectedPolicy.lastUpdated}
                  </Text>
                </View>

                {/* Policy Text */}
                <Text
                  className="font-inter-regular"
                  style={{
                    fontSize: typography.size.base,
                    color: colors.dark[400],
                    lineHeight: 24,
                  }}
                >
                  {selectedPolicy.content}
                </Text>

                {/* Bottom Spacing */}
                <View style={{ height: spacing.xl }} />
              </>
            )}
          </ScrollView>

          {/* Close Button */}
          <View
            className="px-5 py-4"
            style={{ borderTopWidth: 1, borderTopColor: colors.light[200] }}
          >
            <TouchableOpacity
              onPress={handleCloseModal}
              activeOpacity={0.85}
              className="rounded-lg py-4 items-center"
              style={{ backgroundColor: colors.primary[700] }}
            >
              <Text
                className="font-inter-bold"
                style={{ fontSize: typography.size.base, color: colors.light[400] }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
