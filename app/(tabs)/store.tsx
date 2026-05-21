import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";

export default function StoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { products, currentUser, buyProduct } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const activeProducts = products.filter((p) => p.isActive);

  const handleBuy = async (product: Product) => {
    if (!currentUser) {
      Alert.alert("تسجيل الدخول مطلوب", "يجب تسجيل الدخول للشراء", [
        { text: "إلغاء", style: "cancel" },
        { text: "تسجيل الدخول", onPress: () => router.push("/login") },
      ]);
      return;
    }

    const finalPrice = product.price * (1 - currentUser.vipLevel * 0.05);
    if (currentUser.balance < finalPrice) {
      Alert.alert("رصيد غير كافٍ", `رصيدك $${currentUser.balance.toFixed(2)}\nالمطلوب $${finalPrice.toFixed(2)}`, [
        { text: "شحن الرصيد", onPress: () => router.push("/recharge") },
        { text: "إلغاء", style: "cancel" },
      ]);
      return;
    }

    Alert.alert(
      "تأكيد الشراء",
      `هل تريد شراء "${product.name}" بـ $${finalPrice.toFixed(2)}؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "شراء",
          onPress: async () => {
            const success = await buyProduct(product);
            if (success) {
              Alert.alert("تمّ الشراء", "تم إضافة المنتج لمشترياتك", [
                { text: "عرض مشترياتي", onPress: () => router.push("/purchases") },
                { text: "حسنًا" },
              ]);
            } else {
              Alert.alert("خطأ", "حدث خطأ أثناء الشراء");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0D0D2B", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <View style={[styles.headerAccent, { backgroundColor: colors.neonPurple }]} />
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>المتجر</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {activeProducts.length} منتج متاح
          </Text>
        </View>
        <Feather name="shopping-bag" size={22} color={colors.neonPurple} />
      </LinearGradient>

      {currentUser && currentUser.vipLevel > 0 && (
        <View style={[styles.vipBanner, { backgroundColor: colors.neonPurple + "15", borderColor: colors.neonPurple + "40" }]}>
          <Feather name="star" size={14} color={colors.neonPurple} />
          <Text style={[styles.vipBannerText, { color: colors.neonPurple }]}>
            خصم VIP {currentUser.vipLevel * 5}% مطبّق تلقائيًا
          </Text>
        </View>
      )}

      <FlatList
        data={activeProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onBuy={handleBuy} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 100 : 80 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="package" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد منتجات حالياً</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 8,
  },
  headerAccent: { width: 4, height: 28, borderRadius: 2 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right" },
  vipBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  vipBannerText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { padding: 16, gap: 12 },
  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, textAlign: "center" },
});
