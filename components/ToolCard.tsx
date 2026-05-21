import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Tool } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const GLOW_COLORS: Record<string, string> = {
  "#8B3DFF": "#1A0A40",
  "#00BFFF": "#0A1A40",
  "#00FF88": "#0A2A1A",
  "#FF8C00": "#2A1A0A",
  "#FF00FF": "#2A0A2A",
};

interface Props {
  tool: Tool;
  onPress: (tool: Tool) => void;
}

export function ToolCard({ tool, onPress }: Props) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;
  const bgColor = GLOW_COLORS[tool.iconColor] ?? "#1A0A40";

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress(tool);
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={[bgColor, "#0A0A20"]}
          style={[
            styles.card,
            {
              borderColor: tool.iconColor + "40",
              shadowColor: tool.iconColor,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: tool.iconColor + "20",
                borderColor: tool.iconColor + "60",
                shadowColor: tool.iconColor,
              },
            ]}
          >
            <Feather name={tool.iconName as any} size={28} color={tool.iconColor} />
          </View>

          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {tool.name}
          </Text>
          <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
            {tool.description}
          </Text>

          <TouchableOpacity
            style={[styles.enterBtn, { backgroundColor: tool.iconColor + "20", borderColor: tool.iconColor + "60" }]}
            onPress={handlePress}
          >
            <Feather name="arrow-left" size={14} color={tool.iconColor} />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, margin: 4 },
  touchable: { flex: 1 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: "flex-end",
    gap: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
    minHeight: 150,
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
    writingDirection: "rtl",
  },
  desc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
    writingDirection: "rtl",
  },
  enterBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
