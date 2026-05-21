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

import { Tool } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const ICON_OPTIONS = ["calculator", "refresh-cw", "edit-3", "github", "globe", "zap", "code", "cpu", "database", "link"];
const COLOR_OPTIONS = ["#8B3DFF", "#00BFFF", "#00FF88", "#FF8C00", "#FF00FF", "#FF4466"];

export default function AdminToolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tools, adminAddTool, adminUpdateTool, adminDeleteTool } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("globe");
  const [color, setColor] = useState("#8B3DFF");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleAdd = async () => {
    if (!name.trim() || !url.trim()) { Alert.alert("خطأ", "اكتب الاسم والرابط"); return; }
    const t: Tool = {
      id: Date.now().toString(),
      name: name.trim(),
      description: desc.trim(),
      iconName: icon,
      iconColor: color,
      url: url.trim(),
      order: tools.length + 1,
      isActive: true,
    };
    await adminAddTool(t);
    setShowAdd(false);
    setName(""); setDesc(""); setUrl("");
    Alert.alert("تمّ", "تمت إضافة الأداة");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الأدوات ({tools.length})</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple }]} onPress={() => setShowAdd(true)}>
          <Feather name="plus" size={18} color={colors.neonPurple} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={tools}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }}
        renderItem={({ item }) => (
          <LinearGradient colors={["#12122A", "#0A0A20"]} style={[styles.item, { borderColor: item.iconColor + "30" }]}>
            <View style={[styles.icon, { backgroundColor: item.iconColor + "15", borderColor: item.iconColor + "40" }]}>
              <Feather name={item.iconName as any} size={20} color={item.iconColor} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.url, { color: colors.mutedForeground }]} numberOfLines={1}>{item.url}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: item.isActive ? colors.neonGreen + "40" : colors.border }]} onPress={() => adminUpdateTool(item.id, { isActive: !item.isActive })}>
                <Feather name={item.isActive ? "eye" : "eye-off"} size={14} color={item.isActive ? colors.neonGreen : colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.destructive + "40" }]} onPress={() => Alert.alert("حذف", `حذف "${item.name}"؟`, [{ text: "إلغاء", style: "cancel" }, { text: "حذف", style: "destructive", onPress: () => adminDeleteTool(item.id) }])}>
                <Feather name="trash-2" size={14} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
      />

      <Modal visible={showAdd} animationType="slide" transparent onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.modalCard, { borderColor: colors.neonPurple + "50" }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إضافة أداة</Text>
            <View style={{ gap: 10 }}>
              {[
                { label: "اسم الأداة", value: name, onChange: setName },
                { label: "وصف مختصر", value: desc, onChange: setDesc },
                { label: "الرابط (URL)", value: url, onChange: setUrl },
              ].map((f, i) => (
                <View key={i}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                  <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TextInput style={[styles.input, { color: colors.foreground }]} value={f.value} onChangeText={f.onChange} textAlign="right" autoCapitalize="none" />
                  </View>
                </View>
              ))}

              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>الأيقونة</Text>
              <View style={styles.iconGrid}>
                {ICON_OPTIONS.map((ic) => (
                  <TouchableOpacity key={ic} style={[styles.iconOpt, { backgroundColor: icon === ic ? color + "30" : colors.card, borderColor: icon === ic ? color : colors.border }]} onPress={() => setIcon(ic)}>
                    <Feather name={ic as any} size={18} color={icon === ic ? color : colors.mutedForeground} />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>اللون</Text>
              <View style={styles.colorRow}>
                {COLOR_OPTIONS.map((c) => (
                  <TouchableOpacity key={c} style={[styles.colorOpt, { backgroundColor: c, borderWidth: color === c ? 2 : 0, borderColor: "#fff" }]} onPress={() => setColor(c)} />
                ))}
              </View>
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setShowAdd(false)}>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.neonPurple }]} onPress={handleAdd}>
                <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold" }}>إضافة</Text>
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
  addBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  item: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 12, borderRadius: 14, borderWidth: 1 },
  icon: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  info: { flex: 1, gap: 3, alignItems: "flex-end" },
  name: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  url: { fontSize: 11 },
  actions: { flexDirection: "column", gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.7)" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 20, gap: 14 },
  modalTitle: { fontSize: 17, fontFamily: "Inter_700Bold", textAlign: "right" },
  fieldLabel: { fontSize: 12, textAlign: "right", marginBottom: 4 },
  inputRow: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  input: { fontSize: 14 },
  iconGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  iconOpt: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  colorRow: { flexDirection: "row-reverse", gap: 10 },
  colorOpt: { width: 32, height: 32, borderRadius: 16 },
  modalBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
});
