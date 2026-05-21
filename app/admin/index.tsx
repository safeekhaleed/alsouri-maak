import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface AdminItem {
  icon: string;
  label: string;
  sub: string;
  route: string;
  color: string;
}

const ADMIN_ITEMS: AdminItem[] = [
  { icon: "image", label: "إدارة البنرات", sub: "إضافة، تعديل، حذف البنرات", route: "/admin/banners", color: "#8B3DFF" },
  { icon: "users", label: "المستخدمون", sub: "عرض وإدارة الحسابات", route: "/admin/users", color: "#00BFFF" },
  { icon: "shopping-bag", label: "المتجر", sub: "إدارة المنتجات", route: "/admin/products", color: "#FF8C00" },
  { icon: "book-open", label: "الكورسات", sub: "إدارة الكورسات", route: "/admin/courses", color: "#00FF88" },
  { icon: "tool", label: "الخدمات", sub: "إدارة الخدمات", route: "/admin/services", color: "#FF00FF" },
  { icon: "grid", label: "الأدوات التفاعلية", sub: "إدارة الأدوات", route: "/admin/tools", color: "#FF4466" },
  { icon: "dollar-sign", label: "طلبات الشحن", sub: "قبول أو رفض الطلبات", route: "/admin/recharge", color: "#FFD700" },
  { icon: "bell", label: "إرسال إشعارات", sub: "إشعارات لجميع المستخدمين", route: "/admin/notify", color: "#00BFFF" },
];

export default function AdminPanel() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, users, rechargeRequests, products } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!currentUser?.isAdmin) {
    router.replace("/(tabs)");
    return null;
  }

  const pendingRecharge = rechargeRequests.filter((r) => r.status === "pending").length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#2A0A10", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Feather name="shield" size={18} color={colors.neonOrange} />
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>لوحة التحكم</Text>
        </View>
        <View style={{ width: 22 }} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[
            { label: "مستخدمون", val: users.length, color: colors.neonPurple },
            { label: "منتجات", val: products.length, color: colors.neonBlue },
            { label: "طلبات معلقة", val: pendingRecharge, color: colors.neonOrange },
          ].map((s, i) => (
            <LinearGradient key={i} colors={["#12122A", "#0A0A20"]} style={[styles.statCard, { borderColor: s.color + "40" }]}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>{s.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Admin items */}
        <View style={styles.grid}>
          {ADMIN_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.gridItem} onPress={() => router.push(item.route as any)}>
              <LinearGradient
                colors={[item.color + "15", "#0A0A20"]}
                style={[styles.itemCard, { borderColor: item.color + "40" }]}
              >
                <View style={[styles.itemIcon, { backgroundColor: item.color + "20", borderColor: item.color + "50" }]}>
                  <Feather name={item.icon as any} size={22} color={item.color} />
                  {item.route === "/admin/recharge" && pendingRecharge > 0 && (
                    <View style={[styles.notifDot, { backgroundColor: colors.destructive }]}>
                      <Text style={styles.notifText}>{pendingRecharge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.itemLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.itemSub, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {item.sub}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  content: { padding: 16, gap: 16 },
  statsRow: { flexDirection: "row-reverse", gap: 8 },
  statCard: {
    flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center", gap: 4,
  },
  statVal: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 11, textAlign: "center" },
  grid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "47%", },
  itemCard: {
    borderRadius: 14, borderWidth: 1, padding: 14, gap: 8, alignItems: "flex-end",
    shadowColor: "#8B3DFF", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2,
    shadowRadius: 6, elevation: 4,
  },
  itemIcon: {
    width: 46, height: 46, borderRadius: 12, borderWidth: 1,
    justifyContent: "center", alignItems: "center", position: "relative",
  },
  notifDot: {
    position: "absolute", top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9, justifyContent: "center", alignItems: "center",
  },
  notifText: { color: "#fff", fontSize: 9, fontFamily: "Inter_700Bold" },
  itemLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  itemSub: { fontSize: 10, textAlign: "right" },
});
