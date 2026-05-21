import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Service } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AdminServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { services, adminAddService, adminDeleteService, adminUpdateService } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleAdd = async () => {
    if (!name.trim() || !price) { Alert.alert("خطأ", "أكمل البيانات"); return; }
    const s: Service = {
      id: Date.now().toString(),
      name: name.trim(),
      imageUrl,
      price: parseFloat(price),
      description: desc.trim(),
      isActive: true,
    };
    await adminAddService(s);
    setShowAdd(false);
    setName(""); setDesc(""); setPrice(""); setImageUrl("");
    Alert.alert("تمّ", "تمت إضافة الخدمة");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0A2A1A", "#070714"]} style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}><Feather name="arrow-right" size={22} color={colors.mutedForeground} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الخدمات ({services.length})</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.neonGreen + "20", borderColor: colors.neonGreen }]} onPress={() => setShowAdd(true)}>
          <Feather name="plus" size={18} color={colors.neonGreen} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={services}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }}
        renderItem={({ item }) => (
          <LinearGradient colors={["#0A2A1A", "#0A0A20"]} style={[styles.item, { borderColor: colors.neonGreen + "30" }]}>
            {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" /> : <View style={[styles.thumb, styles.noImg]}><Feather name="tool" size={20} color={colors.neonGreen + "80"} /></View>}
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
              <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={1}>{item.description}</Text>
              <Text style={[styles.price, { color: colors.neonGreen }]}>${item.price}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.neonGreen + "40" }]} onPress={() => adminUpdateService(item.id, { isActive: !item.isActive })}>
                <Feather name={item.isActive ? "eye" : "eye-off"} size={14} color={item.isActive ? colors.neonGreen : colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.destructive + "40" }]} onPress={() => Alert.alert("حذف", `حذف "${item.name}"؟`, [{ text: "إلغاء", style: "cancel" }, { text: "حذف", style: "destructive", onPress: () => adminDeleteService(item.id) }])}>
                <Feather name="trash-2" size={14} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
      />

      <Modal visible={showAdd} animationType="slide" transparent onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.modalCard, { borderColor: colors.neonGreen + "50" }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إضافة خدمة</Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity style={[styles.imagePick, { borderColor: colors.border }]} onPress={async () => { const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 }); if (!r.canceled) setImageUrl(r.assets[0].uri); }}>
                {imageUrl ? <Image source={{ uri: imageUrl }} style={{ width: "100%", height: 80 }} resizeMode="cover" /> : <View style={styles.imgPlaceholder}><Feather name="image" size={22} color={colors.mutedForeground} /></View>}
              </TouchableOpacity>
              {[
                { label: "اسم الخدمة", value: name, onChange: setName },
                { label: "وصف الخدمة", value: desc, onChange: setDesc },
                { label: "السعر ($)", value: price, onChange: setPrice },
              ].map((f, i) => (
                <View key={i}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                  <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TextInput style={[styles.input, { color: colors.foreground }]} value={f.value} onChangeText={f.onChange} textAlign="right" />
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setShowAdd(false)}><Text style={{ color: colors.mutedForeground }}>إلغاء</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.neonGreen }]} onPress={handleAdd}><Text style={{ color: "#070714", fontFamily: "Inter_600SemiBold" }}>إضافة</Text></TouchableOpacity>
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
  thumb: { width: 56, height: 56, borderRadius: 10 },
  noImg: { backgroundColor: "#0A2A1A", justifyContent: "center", alignItems: "center" },
  info: { flex: 1, gap: 3, alignItems: "flex-end" },
  name: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  desc: { fontSize: 11 },
  price: { fontSize: 14, fontFamily: "Inter_700Bold" },
  actions: { flexDirection: "column", gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.7)" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 20, gap: 14 },
  modalTitle: { fontSize: 17, fontFamily: "Inter_700Bold", textAlign: "right" },
  imagePick: { borderWidth: 2, borderStyle: "dashed", borderRadius: 10, height: 80, overflow: "hidden" },
  imgPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  fieldLabel: { fontSize: 12, textAlign: "right", marginBottom: 4 },
  inputRow: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  input: { fontSize: 14 },
  modalBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
});
