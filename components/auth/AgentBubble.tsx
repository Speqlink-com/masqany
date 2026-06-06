/**
 * AgentBubble — typewriter effect.
 * Body font: Inter-Regular.
 * Cursor: Inter for clean rendering.
 */
import { memo, useEffect, useRef, useState } from "react";
import { Animated, Image, Text, View, ViewStyle } from "react-native";

interface AgentBubbleProps {
  message: string;
  speed?: number;
  onComplete?: () => void;
  style?: ViewStyle;
}

export const AgentBubble = memo(function AgentBubble({
  message,
  speed = 18,
  onComplete,
  style,
}: AgentBubbleProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (done) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 380, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [done]);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(message.slice(0, indexRef.current));
      if (indexRef.current >= message.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <View className="flex-row items-start" style={[{ gap: 12 }, style]}>
      <Image
        source={require("@/assets/icons/masqany-agent.webp")}
        className="w-11 h-11 rounded-full"
        resizeMode="cover"
      />
      <View
        className="flex-1 rounded-2xl px-4 py-3"
        style={{ backgroundColor: "#e1e6e8", borderTopLeftRadius: 4 }}
      >
        <Text
          className="font-inter-regular text-dark-300"
          style={{ fontSize: 18, lineHeight: 28 }}
        >
          {displayed}
          {!done && (
            <Animated.Text
              style={{
                opacity: cursorOpacity,
                fontFamily: "Inter_400Regular",
                fontSize: 18,
                color: "#20A6FD",
              }}
            >
              |
            </Animated.Text>
          )}
        </Text>
      </View>
    </View>
  );
});
