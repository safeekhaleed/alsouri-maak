import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Service } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  service: Service;
  onBuy: (service: Service) => void;
  localImage?: any;
}

export function ServiceCard({ service, onBuy, localImage }: Props) {
  const colors = useColors();
  const { currentUser, getDiscountedPrice } = useApp();
  const finalPrice = getDiscountedPrice(service.price);
  const hasDiscount = currentUser && currentUser.vipLevel > 0;

  return (
    <LinearGradient colors={["#0A2A1A", "#0A0A20"]} style={[styles.card, { borderColor: colors.neonGreen + "40" }]}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: colors.neonGreen + "15", borderColor: colors.neonGreen + "40" }]}>
          {localImage ? (
            <Image source={localImage} style={styles.icon} resizeMode="cover" />
          ) : service.imageUrl ? (
            <Image source={{ uri: service.imageUrl }} style={styles.icon} resizeMode="cover" />
          ) : (
            <Feather name="tool" size={28} color={colors.neonGreen} />
          )}
        </View>

        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {service.name}
          </Text>
          <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
            {service.description}
          </Text>
          <View style={styles.priceRow}>
            {hasDiscount && (
              <Text style={[styles.oldPrice, { color: colors.mutedForeground }]}>${service.price}</Text>
            )}
            <Text style={[styles.price, { color: colors.neonGreen }]}>${finalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.buyBtn, { borderColor: colors.neonGreen, backgroundColor: colors.neonGreen + "15", shadowColor: colors.neonGreen }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onBuy(service);
        }}
      >
        <Text style={[styles.buyText, { color: colors.neonGreen }]}>طلب الخدمة</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginBottom: 12,
    shadowColor: "#00FF88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  row: { flexDirection: "row-reverse", gap: 12, alignItems: "center" },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: { width: 64, height: 64, borderRadius: 14 },
  content: { flex: 1, gap: 4, alignItems: "flex-end" },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  desc: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "right" },
  priceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  price: { fontSize: 16, fontFamily: "Inter_700Bold" },
  oldPrice: { fontSize: 11, textDecorationLine: "line-through" },
  buyBtn: {
    alignItems: "center",
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
