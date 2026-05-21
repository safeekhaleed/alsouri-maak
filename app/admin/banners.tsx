import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Banner } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AdminBannersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { banners, adminAddBanner, adminUpdateBanner, adminDeleteBanner } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) setImageUrl(result.assets[0].uri);
  };

  const handleAdd = async () => {
    if (!imageUrl) { Alert.alert("خطأ", "اختر صورة أولاً"); return; }
    const newBanner: Banner = {
      id: Date.now().toString(),
      imageUrl,
      link,
      order: banners.length + 1,
      isActive: true,
    };
    await adminAddBanner(newBanner);
    setShowAdd(false);
    setImageUrl("");
    setLink("");
    Alert.alert("تمّ", "تمت إضافة البنر");
  };

  const toggleActive = (banner: Banner) => {
    adminUpdateBanner(banner.id, { isActive: !banner.isActive });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>إدارة البنرات</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple }]}
          onPress={() => setShowAdd(true)}
        >
          <Feather name="plus" size={18} color={colors.neonPurple} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={banners}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <LinearGradient colors={["#12122A", "#0A0A20"]} style={[styles.item, { borderColor: colors.border }]}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" />
            ) : (
              <View style={[styles.thumb, styles.noImg]}>
                <Feather name="image" size={24} color={colors.mutedForeground} />
              </View>
            )}
            <View style={styles.itemInfo}>
              <Text style={[styles.itemLink, { color: colors.mutedForeground }]} numberOfLines={1}>{item.link || "لا يوجد رابط"}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.isActive ? colors.neonGreen + "20" : colors.muted, borderColor: item.isActive ? colors.neonGreen : colors.border }]}>
                <Text style={[styles.statusText, { color: item.isActive ? colors.neonGreen : colors.mutedForeground }]}>
                  {item.isActive ? "نشط" : "مخفي"}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleActive(item)} style={[styles.actionBtn, { borderColor: colors.border }]}>
                <Feather name={item.isActive ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { Alert.alert("حذف", "هل تريد حذف البنر؟", [{ text: "إلغاء", style: "cancel" }, { text: "حذف", style: "destructive", onPress: () => adminDeleteBanner(item.id) }]); }} style={[styles.actionBtn, { borderColor: colors.destructive + "50" }]}>
                <Feather name="trash-2" size={16} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        ListEmptyComponent={<View style={styles.empty}><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد بنرات</Text></View>}
      />

      <Modal visible={showAdd} animationType="slide" transparent onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.modalCard, { borderColor: colors.neonPurple + "50" }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إضافة بنر جديد</Text>

            <TouchableOpacity style={[styles.imagePick, { borderColor: colors.border }]} onPress={pickImage}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={{ width: "100%", height: 120 }} resizeMode="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Feather name="image" size={28} color={colors.mutedForeground} />
                  <Text style={[{ color: colors.mutedForeground, fontSize: 12, marginTop: 6 }]}>اختر صورة</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={link}
                onChangeText={setLink}
                placeholder="رابط البنر (اختياري)"
                placeholderTextColor={colors.mutedForeground}
                textAlign="right"
              />
              <Feather name="link" size={16} color={colors.mutedForeground} />
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setShowAdd(false)}>
                <Text style={[{ color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>إلغاء</Text>
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
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  item: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  thumb: { width: 70, height: 50, borderRadius: 8 },
  noImg: { backgroundColor: "#1A1A3E", justifyContent: "center", alignItems: "center" },
  itemInfo: { flex: 1, gap: 6, alignItems: "flex-end" },
  itemLink: { fontSize: 11 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  statusText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  actions: { flexDirection: "row", gap: 6 },
  actionBtn: { width: 34, height: 34, borderRadius: 8, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.7)" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 20, gap: 14 },
  modalTitle: { fontSize: 17, fontFamily: "Inter_700Bold", textAlign: "right" },
  imagePick: { borderWidth: 2, borderStyle: "dashed", borderRadius: 12, height: 120, overflow: "hidden" },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  inputRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
  input: { flex: 1, fontSize: 14 },
  modalBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
});
