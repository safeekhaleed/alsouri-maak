import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Course } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  course: Course;
  onBuy: (course: Course) => void;
  localImage?: any;
}

export function CourseCard({ course, onBuy, localImage }: Props) {
  const colors = useColors();
  const { currentUser, getDiscountedPrice } = useApp();
  const scale = useRef(new Animated.Value(1)).current;

  const finalPrice = getDiscountedPrice(course.price);
  const hasDiscount = currentUser && currentUser.vipLevel > 0;

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: 12 }}>
      <LinearGradient colors={["#0A1A40", "#0A0A20"]} style={[styles.card, { borderColor: colors.neonBlue + "40" }]}>
        <View style={styles.imageWrap}>
          {localImage ? (
            <Image source={localImage} style={styles.image} resizeMode="cover" />
          ) : course.imageUrl ? (
            <Image source={{ uri: course.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <LinearGradient colors={["#0A2050", "#0A0A30"]} style={[styles.image, styles.placeholderImg]}>
              <Feather name="book-open" size={32} color={colors.neonBlue + "80"} />
            </LinearGradient>
          )}
          <View style={[styles.lessonsBadge, { backgroundColor: colors.neonBlue + "20", borderColor: colors.neonBlue + "60" }]}>
            <Feather name="play-circle" size={12} color={colors.neonBlue} />
            <Text style={[styles.lessonsText, { color: colors.neonBlue }]}>{course.lessonsCount} درس</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
            {course.name}
          </Text>
          <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
            {course.description}
          </Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.buyBtn, { borderColor: colors.neonBlue, backgroundColor: colors.neonBlue + "15", shadowColor: colors.neonBlue }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onBuy(course);
              }}
            >
              <Text style={[styles.buyText, { color: colors.neonBlue }]}>اشترك الآن</Text>
            </TouchableOpacity>
            <View style={styles.priceCol}>
              {hasDiscount && (
                <Text style={[styles.oldPrice, { color: colors.mutedForeground }]}>${course.price}</Text>
              )}
              <Text style={[styles.price, { color: colors.neonGreen }]}>${finalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  imageWrap: { position: "relative" },
  image: { width: "100%", height: 140 },
  placeholderImg: { justifyContent: "center", alignItems: "center" },
  lessonsBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  lessonsText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  info: { padding: 12, gap: 8 },
  name: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "right", writingDirection: "rtl" },
  desc: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "right", writingDirection: "rtl" },
  row: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  priceCol: { alignItems: "flex-end" },
  price: { fontSize: 16, fontFamily: "Inter_700Bold" },
  oldPrice: { fontSize: 11, textDecorationLine: "line-through" },
  buyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buyText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
