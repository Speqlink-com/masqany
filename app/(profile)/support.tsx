/**
 * Support Screen
 * Displays customer support contact information, support ticket submission, and FAQ section
 * Uses NativeWind (Tailwind CSS) for styling
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7
 */
import { ScreenHeader } from "@/components/profile";
import { colors, spacing, typography } from "@/constants/tokens";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: "1",
    question: "How do I book a property?",
    answer:
      "Browse properties on the Home screen, select your desired dates, and click the Book Now button. You'll be guided through the booking process with payment options and confirmation.",
  },
  {
    id: "2",
    question: "How do I become a host?",
    answer:
      "Go to Profile > Account Settings and enable Host mode. You'll need to complete the host verification process and add your first property listing.",
  },
  {
    id: "3",
    question: "How do I contact support?",
    answer:
      "You can reach us via email at support@masqany.com or call us at +254 700 000 000. Our support team is available Monday to Friday, 9 AM to 6 PM EAT.",
  },
  {
    id: "4",
    question: "What payment methods are accepted?",
    answer:
      "We accept M-Pesa, credit/debit cards (Visa, Mastercard), and bank transfers. All payments are processed securely through our payment partners.",
  },
  {
    id: "5",
    question: "How do I cancel a booking?",
    answer:
      "Go to your Bookings section, select the booking you want to cancel, and tap Cancel Booking. Refund eligibility depends on the property's cancellation policy.",
  },
];

export default function SupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Handle email contact
  const handleEmailPress = async () => {
    const email = "support@masqany.com";
    const url = `mailto:${email}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open email client");
      }
    } catch (error) {
      console.error("Error opening email:", error);
      Alert.alert("Error", "Failed to open email client");
    }
  };

  // Handle phone contact
  const handlePhonePress = async () => {
    const phone = "+254700000000";
    const url = `tel:${phone}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to make phone call");
      }
    } catch (error) {
      console.error("Error opening phone:", error);
      Alert.alert("Error", "Failed to open phone dialer");
    }
  };

  // Handle support ticket submission (placeholder)
  const handleSubmitTicket = () => {
    Alert.alert(
      "Coming Soon",
      "Support ticket submission will be available soon. For now, please contact us via email or phone."
    );
  };

  // Toggle FAQ expansion
  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
          <ScreenHeader title="Support" />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-5 py-6">
              {/* Contact Information Section */}
              <View className="mb-6">
                <Text
                  className="font-poppins-semibold mb-4"
                  style={{ fontSize: typography.size.lg, color: colors.dark[400] }}
                >
                  Contact Us
                </Text>

                {/* Email Card */}
                <TouchableOpacity
                  onPress={handleEmailPress}
                  activeOpacity={0.7}
                  className="bg-white rounded-lg p-4 mb-3 flex-row items-center"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: colors.primary[50] }}
                  >
                    <Text style={{ fontSize: 24 }}>✉️</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-inter-semibold mb-1"
                      style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                    >
                      Email Support
                    </Text>
                    <Text
                      className="font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.primary[700] }}
                    >
                      support@masqany.com
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: colors.dark[100] }}>›</Text>
                </TouchableOpacity>

                {/* Phone Card */}
                <TouchableOpacity
                  onPress={handlePhonePress}
                  activeOpacity={0.7}
                  className="bg-white rounded-lg p-4 mb-3 flex-row items-center"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: colors.primary[50] }}
                  >
                    <Text style={{ fontSize: 24 }}>📞</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-inter-semibold mb-1"
                      style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                    >
                      Phone Support
                    </Text>
                    <Text
                      className="font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.primary[700] }}
                    >
                      +254 796218073
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: colors.dark[100] }}>›</Text>
                </TouchableOpacity>

                {/* Support Hours */}
                <View
                  className="rounded-lg p-4"
                  style={{ backgroundColor: colors.primary[50] }}
                >
                  <Text
                    className="font-inter-regular"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    📅 Support Hours: Monday - Friday, 9 AM - 6 PM EAT
                  </Text>
                </View>
              </View>

              {/* Submit Support Ticket Section */}
              <View className="mb-6">
                <Text
                  className="font-poppins-semibold mb-4"
                  style={{ fontSize: typography.size.lg, color: colors.dark[400] }}
                >
                  Need Help?
                </Text>

                <TouchableOpacity
                  onPress={handleSubmitTicket}
                  activeOpacity={0.85}
                  className="rounded-lg py-4 items-center"
                  style={{ backgroundColor: colors.primary[700] }}
                >
                  <Text
                    className="font-inter-bold"
                    style={{ fontSize: typography.size.base, color: colors.light[400] }}
                  >
                    Submit a Support Ticket
                  </Text>
                </TouchableOpacity>

                <Text
                  className="font-inter-regular mt-3 text-center"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  Our support team typically responds within 24 hours
                </Text>
              </View>

              {/* FAQ Section */}
              <View>
                <Text
                  className="font-poppins-semibold mb-4"
                  style={{ fontSize: typography.size.lg, color: colors.dark[400] }}
                >
                  Frequently Asked Questions
                </Text>

                {FAQS.map((faq) => {
                  const isExpanded = expandedFAQ === faq.id;

                  return (
                    <TouchableOpacity
                      key={faq.id}
                      onPress={() => toggleFAQ(faq.id)}
                      activeOpacity={0.7}
                      className="bg-white rounded-lg p-4 mb-3"
                    >
                      <View className="flex-row items-center justify-between">
                        <Text
                          className="flex-1 font-inter-semibold mr-3"
                          style={{
                            fontSize: typography.size.base,
                            color: colors.dark[400],
                          }}
                        >
                          {faq.question}
                        </Text>
                        <Text
                          style={{
                            fontSize: 20,
                            color: colors.primary[700],
                            transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                          }}
                        >
                          ▼
                        </Text>
                      </View>

                      {isExpanded && (
                        <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.light[200] }}>
                          <Text
                            className="font-inter-regular"
                            style={{
                              fontSize: typography.size.sm,
                              color: colors.dark[100],
                              lineHeight: 20,
                            }}
                          >
                            {faq.answer}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Additional Help */}
              <View
                className="rounded-lg p-4 mt-6"
                style={{ backgroundColor: colors.light[300] }}
              >
                <Text
                  className="font-inter-semibold mb-2"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Still need help?
                </Text>
                <Text
                  className="font-inter-regular"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  If you can't find the answer you're looking for, please don't hesitate to contact our support team. We're here to help!
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
