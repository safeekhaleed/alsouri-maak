import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Purchase } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function PurchasesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, purchases } = useApp();
  const [selected, setSelected] = useState<Purchase | null>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!currentUser) {
    router.replace("/login");
    return null;
  }

  const myPurchases = purchases
    .filter((p) => p.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const renderItem = ({ item }: { item: Purchase }) => {
    const iconMap: Record<string, string> = { file: "file", video: "video", text: "file-text" };
    const colorMap: Record<string, string> = {
      file: colors.neonBlue,
      video: colors.neonOrange,
      text: colors.neonGreen,
    };
    const icon = iconMap[item.contentType] ?? "package";
    const clr = colorMap[item.contentType] ?? colors.neonPurple;

    return (
      <TouchableOpacity onPress={() => setSelected(item)}>
        <LinearGradient colors={["#12122A", "#0A0A20"]} style={[styles.item, { borderColor: clr + "30" }]}>
          <View style={[styles.itemIcon, { backgroundColor: clr + "15", borderColor: clr + "40" }]}>
            <Feather name={icon as any} size={20} color={clr} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>
              {item.productName}
            </Text>
            <Text style={[styles.itemDate, { color: colors.mutedForeground }]}>
              {new Date(item.createdAt).toLocaleDateString("ar-SA")}
            </Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={[styles.itemPrice, { color: colors.neonGreen }]}>
              ${item.productPrice.toFixed(2)}
            </Text>
            <Feather name="chevron-left" size={16} color={colors.mutedForeground} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0D0D2B", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>مشترياتي</Text>
        <View style={[styles.countBadge, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple + "50" }]}>
          <Text style={[styles.countText, { color: colors.neonPurple }]}>{myPurchases.length}</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={myPurchases}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="shopping-bag" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد مشتريات بعد</Text>
          </View>
        }
      />

      {/* Content Modal */}
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.modalCard, { borderColor: colors.neonPurple + "40" }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.foreground }]} numberOfLines={1}>
                {selected?.productName}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
              <Text style={[styles.modalContent, { color: colors.foreground }]}>
                {selected?.content}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeModalBtn, { backgroundColor: colors.neonPurple }]}
              onPress={() => setSelected(null)}
            >
              <Text style={styles.closeModalText}>إغلاق</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  countBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1,
  },
  countText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  list: { padding: 16, gap: 8 },
  item: {
    flexDirection: "row-reverse", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8,
  },
  itemIcon: {
    width: 44, height: 44, borderRadius: 12, borderWidth: 1,
    justifyContent: "center", alignItems: "center",
  },
  itemInfo: { flex: 1, alignItems: "flex-end" },
  itemName: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  itemDate: { fontSize: 11, marginTop: 2 },
  itemRight: { alignItems: "center", gap: 4 },
  itemPrice: { fontSize: 13, fontFamily: "Inter_700Bold" },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, textAlign: "center" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.7)" },
  modalCard: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1,
    padding: 20, gap: 16,
  },
  modalHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontSize: 16, fontFamily: "Inter_700Bold", flex: 1, textAlign: "right", marginHorizontal: 12 },
  modalContent: { fontSize: 14, lineHeight: 22, textAlign: "right" },
  closeModalBtn: { paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  closeModalText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
