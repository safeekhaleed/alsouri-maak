import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Filter = "all" | "pending" | "approved" | "rejected";

export default function AdminRechargeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { rechargeRequests, adminApproveRecharge, adminRejectRecharge } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = [...rechargeRequests]
    .filter((r) => filter === "all" || r.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pendingCount = rechargeRequests.filter((r) => r.status === "pending").length;

  const statusColor: Record<string, string> = {
    pending: colors.neonOrange,
    approved: colors.neonGreen,
    rejected: colors.destructive,
  };

  const statusLabel: Record<string, string> = {
    pending: "معلق",
    approved: "مقبول",
    rejected: "مرفوض",
  };

  const methodColor: Record<string, string> = {
    "شام كاش": "#8B3DFF",
    "Binance Pay": "#F0B90B",
    "USDT TRC20": "#00FF88",
  };

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: "pending", label: "معلق" },
    { key: "approved", label: "مقبول" },
    { key: "rejected", label: "مرفوض" },
  ];

  const handleApprove = (id: string, amount: number) => {
    Alert.alert(
      "✅ موافقة على الشحن",
      `الموافقة على شحن $${amount} وإضافته للرصيد؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "موافقة",
          onPress: async () => {
            await adminApproveRecharge(id);
          },
        },
      ]
    );
  };

  const handleReject = (id: string, amount: number) => {
    Alert.alert(
      "❌ رفض الطلب",
      `رفض طلب شحن $${amount}؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "رفض",
          style: "destructive",
          onPress: async () => {
            await adminRejectRecharge(id);
          },
        },
      ]
    );
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0D0D2B", "#070714"]}
        style={[s.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={[s.headerTitle, { color: colors.foreground }]}>طلبات الشحن</Text>
          {pendingCount > 0 && (
            <View style={[s.badge, { backgroundColor: colors.neonOrange }]}>
              <Text style={s.badgeText}>{pendingCount}</Text>
            </View>
          )}
        </View>
        <View style={{ width: 22 }} />
      </LinearGradient>

      {/* Filter tabs */}
      <View style={[s.filterRow, { borderBottomColor: colors.border }]}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[s.filterBtn, {
              borderBottomColor: filter === f.key ? colors.neonPurple : "transparent",
            }]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[s.filterTxt, { color: filter === f.key ? colors.neonPurple : colors.mutedForeground }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{
          padding: 14,
          gap: 12,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
        }}
        renderItem={({ item }) => {
          const mc = methodColor[item.method] ?? colors.neonBlue;
          return (
            <LinearGradient
              colors={["#12122A", "#0A0A20"]}
              style={[s.item, { borderColor: statusColor[item.status] + "40" }]}
            >
              {/* Header row */}
              <View style={s.itemTopRow}>
                <View style={[s.statusBadge, { backgroundColor: statusColor[item.status] + "20", borderColor: statusColor[item.status] + "60" }]}>
                  <Text style={[s.statusText, { color: statusColor[item.status] }]}>
                    {statusLabel[item.status]}
                  </Text>
                </View>
                <Text style={[s.userName, { color: colors.foreground }]}>{item.userName}</Text>
              </View>

              {/* Amount + Method */}
              <View style={s.amountMethodRow}>
                {item.method ? (
                  <View style={[s.methodTag, { backgroundColor: mc + "20", borderColor: mc + "50" }]}>
                    <Text style={[s.methodTagTxt, { color: mc }]}>{item.method}</Text>
                  </View>
                ) : null}
                <Text style={[s.amount, { color: colors.neonGreen }]}>${item.amount}</Text>
              </View>

              <Text style={[s.date, { color: colors.mutedForeground }]}>
                {new Date(item.createdAt).toLocaleString("ar-SA")}
              </Text>

              {item.proofImageUrl ? (
                <Image source={{ uri: item.proofImageUrl }} style={s.proofImg} resizeMode="cover" />
              ) : null}

              {item.status === "pending" && (
                <View style={s.actions}>
                  <TouchableOpacity
                    style={[s.rejectBtn, { backgroundColor: colors.destructive + "20", borderColor: colors.destructive }]}
                    onPress={() => handleReject(item.id, item.amount)}
                  >
                    <Feather name="x" size={16} color={colors.destructive} />
                    <Text style={[s.actionText, { color: colors.destructive }]}>رفض</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.approveBtn, { backgroundColor: colors.neonGreen + "20", borderColor: colors.neonGreen }]}
                    onPress={() => handleApprove(item.id, item.amount)}
                  >
                    <Feather name="check" size={16} color={colors.neonGreen} />
                    <Text style={[s.actionText, { color: colors.neonGreen }]}>موافقة + إضافة رصيد</Text>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          );
        }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="inbox" size={48} color={colors.mutedForeground} />
            <Text style={[s.emptyText, { color: colors.mutedForeground }]}>لا توجد طلبات</Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerCenter: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  badge: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  filterRow: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
  },
  filterTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  item: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  itemTopRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  userName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  amountMethodRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  amount: { fontSize: 22, fontFamily: "Inter_700Bold" },
  methodTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  methodTagTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  date: { fontSize: 11 },
  proofImg: { width: "100%", height: 150, borderRadius: 10 },
  actions: { flexDirection: "row-reverse", gap: 10 },
  approveBtn: {
    flex: 2,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, textAlign: "center" },
});
