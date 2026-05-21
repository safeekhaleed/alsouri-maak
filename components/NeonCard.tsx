import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useColors } from "@/hooks/useColors";

interface NeonCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  gradientColors?: [string, string, ...string[]];
  borderColor?: string;
}

export function NeonCard({
  children,
  style,
  glowColor,
  gradientColors,
  borderColor,
}: NeonCardProps) {
  const colors = useColors();
  const glow = glowColor ?? colors.glowPurple;
  const border = borderColor ?? colors.neonPurple;

  return (
    <View
      style={[
        styles.wrapper,
        {
          shadowColor: glow,
          borderColor: border + "60",
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors ?? ["#12123A", "#0A0A20"]}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  gradient: {
    borderRadius: 16,
  },
});
