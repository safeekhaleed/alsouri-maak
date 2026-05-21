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

import { Product } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  product: Product;
  onBuy: (product: Product) => void;
  localImage?: any;
}

export function ProductCard({ product, onBuy, localImage }: Props) {
  const colors = useColors();
  const { currentUser, getDiscountedPrice } = useApp();
  const scale = useRef(new Animated.Value(1)).current;

  const finalPrice = getDiscountedPrice(product.price);
  const hasDiscount = currentUser && currentUser.vipLevel > 0;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: 12 }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient colors={["#1A0A40", "#0A0A20"]} style={[styles.card, { borderColor: colors.neonPurple + "40" }]}>
          <View style={styles.imageWrap}>
            {localImage ? (
              <Image source={localImage} style={styles.image} resizeMode="cover" />
            ) : product.imageUrl ? (
              <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
            ) : (
              <LinearGradient colors={["#2A0A50", "#0A0A30"]} style={[styles.image, styles.placeholderImg]}>
                <Feather name="package" size={32} color={colors.neonPurple + "80"} />
              </LinearGradient>
            )}
            {product.quantity <= 5 && product.quantity > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.neonOrange }]}>
                <Text style={styles.badgeText}>{product.quantity} متبقي</Text>
              </View>
            )}
            {product.quantity === 0 && (
              <View style={[styles.badge, { backgroundColor: colors.destructive }]}>
                <Text style={styles.badgeText}>نفد</Text>
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
              {product.name}
            </Text>
            <View style={styles.priceRow}>
              {hasDiscount && (
                <Text style={[styles.oldPrice, { color: colors.mutedForeground }]}>
                  ${product.price}
                </Text>
              )}
              <Text style={[styles.price, { color: colors.neonGreen }]}>${finalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.buyBtn,
                {
                  backgroundColor: product.quantity === 0 ? colors.muted : colors.neonPurple + "20",
                  borderColor: product.quantity === 0 ? colors.border : colors.neonPurple,
                  shadowColor: colors.neonPurple,
                },
              ]}
              onPress={() => {
                if (product.quantity > 0) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onBuy(product);
                }
              }}
              disabled={product.quantity === 0}
            >
              <Feather name="shopping-cart" size={14} color={product.quantity === 0 ? colors.mutedForeground : colors.neonPurple} />
              <Text style={[styles.buyText, { color: product.quantity === 0 ? colors.mutedForeground : colors.neonPurple }]}>
                {product.quantity === 0 ? "نفد المخزون" : "شراء الآن"}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
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
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  info: { padding: 12, gap: 8 },
  name: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
    writingDirection: "rtl",
  },
  priceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  price: { fontSize: 16, fontFamily: "Inter_700Bold" },
  oldPrice: { fontSize: 12, textDecorationLine: "line-through" },
  buyBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buyText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
