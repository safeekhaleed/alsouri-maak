import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ServiceCard } from "@/components/ServiceCard";
import { Service } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { services, currentUser, buyService } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const activeServices = services.filter((s) => s.isActive);

  const handleBuy = async (service: Service) => {
    if (!currentUser) {
      Alert.alert("تسجيل الدخول مطلوب", "", [
        { text: "إلغاء", style: "cancel" },
        { text: "تسجيل الدخول", onPress: () => router.push("/login") },
      ]);
      return;
    }

    const finalPrice = service.price * (1 - currentUser.vipLevel * 0.05);
    if (currentUser.balance < finalPrice) {
      Alert.alert("رصيد غير كافٍ", `المطلوب $${finalPrice.toFixed(2)}`, [
        { text: "شحن الرصيد", onPress: () => router.push("/recharge") },
        { text: "إلغاء", style: "cancel" },
      ]);
      return;
    }

    Alert.alert("تأكيد الطلب", `طلب "${service.name}" بـ $${finalPrice.toFixed(2)}؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "طلب",
        onPress: async () => {
          const ok = await buyService(service);
          if (ok) Alert.alert("تمّ الطلب", "سيتواصل معك الفريق قريباً");
          else Alert.alert("خطأ", "حدث خطأ");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0A2A1A", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <Feather name="headphones" size={22} color={colors.neonGreen} />
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الخدمات</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {activeServices.length} خدمة متاحة
          </Text>
        </View>
        <View style={[styles.headerAccent, { backgroundColor: colors.neonGreen }]} />
      </LinearGradient>

      <FlatList
        data={activeServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServiceCard service={item} onBuy={handleBuy} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 100 : 80 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="headphones" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد خدمات حالياً</Text>
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
  },
  headerAccent: { width: 4, height: 28, borderRadius: 2 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right" },
  list: { padding: 16 },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, textAlign: "center" },
});
