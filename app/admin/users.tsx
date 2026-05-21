import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppUser } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AdminUsersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { users, adminUpdateUser, currentUser } = useApp();
  const [selected, setSelected] = useState<AppUser | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [editVip, setEditVip] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const openEdit = (user: AppUser) => {
    setSelected(user);
    setEditBalance(String(user.balance));
    setEditVip(String(user.vipLevel));
  };

  const handleSave = async () => {
    if (!selected) return;
    const bal = parseFloat(editBalance);
    const vip = parseInt(editVip);
    if (isNaN(bal) || isNaN(vip) || vip < 0 || vip > 6) {
      Alert.alert("خطأ", "أدخل قيماً صحيحة");
      return;
    }
    await adminUpdateUser(selected.id, { balance: bal, vipLevel: vip });
    setSelected(null);
    Alert.alert("تمّ", "تم تحديث بيانات المستخدم");
  };

  const vipColors: Record<number, string> = {
    0: colors.mutedForeground, 1: "#C0C0C0", 2: "#FFD700",
    3: "#00BFFF", 4: "#8B3DFF", 5: "#FF8C00", 6: "#FF00FF",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>المستخدمون ({users.length})</Text>
        <View style={{ width: 22 }} />
      </LinearGradient>

      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }}
        renderItem={({ item }) => (
          <LinearGradient colors={["#12122A", "#0A0A20"]} style={[styles.item, { borderColor: item.isAdmin ? colors.neonOrange + "40" : colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: (vipColors[item.vipLevel] ?? colors.border) + "20", borderColor: vipColors[item.vipLevel] ?? colors.border }]}>
              <Text style={[styles.avatarText, { color: vipColors[item.vipLevel] ?? colors.mutedForeground }]}>
                {item.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.foreground }]}>{item.name}</Text>
                {item.isAdmin && (
                  <View style={[styles.adminBadge, { backgroundColor: colors.neonOrange + "20", borderColor: colors.neonOrange + "60" }]}>
                    <Text style={[styles.adminText, { color: colors.neonOrange }]}>أدمن</Text>
                  </View>
                )}
                {item.isBanned && (
                  <View style={[styles.adminBadge, { backgroundColor: colors.destructive + "20", borderColor: colors.destructive + "60" }]}>
                    <Text style={[styles.adminText, { color: colors.destructive }]}>محظور</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.email, { color: colors.mutedForeground }]}>{item.email}</Text>
              <View style={styles.stats}>
                <Text style={[styles.statText, { color: colors.neonGreen }]}>${item.balance.toFixed(0)}</Text>
                {item.vipLevel > 0 && (
                  <Text style={[styles.statText, { color: vipColors[item.vipLevel] }]}>VIP {item.vipLevel}</Text>
                )}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: colors.neonBlue + "50" }]}
                onPress={() => openEdit(item)}
              >
                <Feather name="edit-2" size={14} color={colors.neonBlue} />
              </TouchableOpacity>
              {item.id !== currentUser?.id && (
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: item.isBanned ? colors.neonGreen + "50" : colors.destructive + "50" }]}
                  onPress={() => {
                    Alert.alert(
                      item.isBanned ? "رفع الحظر" : "حظر المستخدم",
                      `هل تريد ${item.isBanned ? "رفع حظر" : "حظر"} ${item.name}؟`,
                      [
                        { text: "إلغاء", style: "cancel" },
                        { text: "تأكيد", onPress: () => adminUpdateUser(item.id, { isBanned: !item.isBanned }) },
                      ]
                    );
                  }}
                >
                  <Feather name={item.isBanned ? "unlock" : "lock"} size={14} color={item.isBanned ? colors.neonGreen : colors.destructive} />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        )}
      />

      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.modalCard, { borderColor: colors.neonBlue + "50" }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>تعديل: {selected?.name}</Text>

            {[
              { label: "الرصيد ($)", value: editBalance, onChange: setEditBalance, keyboard: "decimal-pad" as const },
              { label: "مستوى VIP (0-6)", value: editVip, onChange: setEditVip, keyboard: "number-pad" as const },
            ].map((f, i) => (
              <View key={i} style={styles.inputWrap}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    value={f.value}
                    onChangeText={f.onChange}
                    keyboardType={f.keyboard}
                    textAlign="right"
                  />
                </View>
              </View>
            ))}

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setSelected(null)}>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.neonBlue }]} onPress={handleSave}>
                <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold" }}>حفظ</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  item: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 12, borderRadius: 14, borderWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  info: { flex: 1, gap: 3, alignItems: "flex-end" },
  nameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  name: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  adminBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  adminText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  email: { fontSize: 11 },
  stats: { flexDirection: "row-reverse", gap: 8 },
  statText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  actions: { flexDirection: "column", gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.7)" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 20, gap: 14 },
  modalTitle: { fontSize: 17, fontFamily: "Inter_700Bold", textAlign: "right" },
  inputWrap: { gap: 6 },
  inputLabel: { fontSize: 13, textAlign: "right" },
  inputRow: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
  input: { fontSize: 14 },
  modalBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
});
