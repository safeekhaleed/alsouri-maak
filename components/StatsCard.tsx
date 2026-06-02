import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  icon: string;
  value: string;
  label: string;
  color: string;
  bgColor: [string, string];
  delay?: number;
}

export function StatsCard({ icon, value, label, color, bgColor, delay = 0 }: Props) {
  const colors = useColors();
  const anim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: anim,
        transform: [{ scale: anim }, { scale: pulse }],
      }}
    >
      <LinearGradient
        colors={bgColor}
        style={[
          styles.card,
          { borderColor: color + "50", shadowColor: color },
        ]}
      >
        <Feather name={icon as any} size={20} color={color} />
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    gap: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  value: { fontSize: 18, fontFamily: "Inter_700Bold" },
  label: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
});
