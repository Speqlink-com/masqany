/**
 * PropertyFormProgress Component
 * 
 * Visual progress indicator with animated step dots
 * Shows completed, current, and upcoming steps
 */

import { colors } from "@/constants/tokens";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

interface PropertyFormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function PropertyFormProgress({
  currentStep,
  totalSteps,
}: PropertyFormProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View className="flex-row items-center justify-center py-4">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <StepDot
            step={step}
            currentStep={currentStep}
            isCompleted={step < currentStep}
            isCurrent={step === currentStep}
          />
          {index < steps.length - 1 && (
            <View
              className="h-0.5 mx-2"
              style={{
                width: 24,
                backgroundColor:
                  step < currentStep ? colors.primary[700] : colors.light[200],
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

interface StepDotProps {
  step: number;
  currentStep: number;
  isCompleted: boolean;
  isCurrent: boolean;
}

function StepDot({ isCompleted, isCurrent }: StepDotProps) {
  const scale = useSharedValue(1);

  // Pulse animation for current step
  useEffect(() => {
    if (isCurrent) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1, // Infinite repeat
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [isCurrent, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Determine dot style
  const getDotStyle = () => {
    if (isCompleted || isCurrent) {
      return {
        backgroundColor: colors.primary[700],
        width: 12,
        height: 12,
        borderRadius: 6,
      };
    }
    return {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.light[200],
      width: 12,
      height: 12,
      borderRadius: 6,
    };
  };

  return (
    <Animated.View style={[getDotStyle(), isCurrent && animatedStyle]} />
  );
}
