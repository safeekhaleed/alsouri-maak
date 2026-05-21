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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Product } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AdminProductsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { products, adminAddProduct, adminUpdateProduct, adminDeleteProduct } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [imageUrl, setImageUrl] = useState("");
  const [contentType, setContentType] = useState<"file" | "video" | "text">("text");
  const [content, setContent] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) setImageUrl(result.assets[0].uri);
  };

  const handleAdd = async () => {
    if (!name.trim() || !price || !content.trim()) {
      Alert.alert("خطأ", "اكتب اسم المنتج والسعر والمحتوى");
      return;
    }
    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim(),
      imageUrl,
      price: parseFloat(price),
      contentType,
      content: content.trim(),
      quantity: parseInt(quantity) || 10,
      isActive: true,
    };
    await adminAddProduct(newProduct);
    setShowAdd(false);
    setName(""); setPrice(""); setContent(""); setImageUrl(""); setQuantity("10");
    Alert.alert("تمّ", "تمت إضافة المنتج");
  };

  const contentTypeColors: Record<string, string> = {
    file: colors.neonBlue,
    video: colors.neonOrange,
    text: colors.neonGreen,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>إدارة المتجر ({products.length})</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple }]} onPress={() => setShowAdd(true)}>
          <Feather name="plus" size={18} color={colors.neonPurple} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }}
        renderItem={({ item }) => (
          <LinearGradient colors={["#12122A", "#0A0A20"]} style={[styles.item, { borderColor: colors.border }]}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" />
            ) : (
              <View style={[styles.thumb, styles.noImg]}><Feather name="package" size={22} color={colors.mutedForeground} /></View>
            )}
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
              <View style={styles.row}>
                <Text style={[styles.price, { color: colors.neonGreen }]}>${item.price}</Text>
                <View style={[styles.typeBadge, { backgroundColor: (contentTypeColors[item.contentType] ?? colors.neonPurple) + "20", borderColor: (contentTypeColors[item.contentType] ?? colors.neonPurple) + "50" }]}>
                  <Text style={[styles.typeText, { color: contentTypeColors[item.contentType] ?? colors.neonPurple }]}>{item.contentType}</Text>
                </View>
              </View>
              <Text style={[styles.qty, { color: colors.mutedForeground }]}>الكمية: {item.quantity}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: item.isActive ? colors.neonGreen + "40" : colors.border }]} onPress={() => adminUpdateProduct(item.id, { isActive: !item.isActive })}>
                <Feather name={item.isActive ? "eye" : "eye-off"} size={14} color={item.isActive ? colors.neonGreen : colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.destructive + "40" }]} onPress={() => Alert.alert("حذف", `حذف "${item.name}"؟`, [{ text: "إلغاء", style: "cancel" }, { text: "حذف", style: "destructive", onPress: () => adminDeleteProduct(item.id) }])}>
                <Feather name="trash-2" size={14} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
      />

      <Modal visible={showAdd} animationType="slide" transparent onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.modalCard, { borderColor: colors.neonPurple + "50" }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>إضافة منتج</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
              <View style={{ gap: 12 }}>
                <TouchableOpacity style={[styles.imagePick, { borderColor: colors.border }]} onPress={pickImage}>
                  {imageUrl ? <Image source={{ uri: imageUrl }} style={{ width: "100%", height: 100 }} resizeMode="cover" /> : <View style={styles.imgPlaceholder}><Feather name="image" size={24} color={colors.mutedForeground} /><Text style={[{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }]}>اختر صورة</Text></View>}
                </TouchableOpacity>
                {[
                  { label: "اسم المنتج", value: name, onChange: setName, keyboard: "default" as const },
                  { label: "السعر ($)", value: price, onChange: setPrice, keyboard: "decimal-pad" as const },
                  { label: "الكمية", value: quantity, onChange: setQuantity, keyboard: "number-pad" as const },
                ].map((f, i) => (
                  <View key={i}>
                    <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                    <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <TextInput style={[styles.input, { color: colors.foreground }]} value={f.value} onChangeText={f.onChange} keyboardType={f.keyboard} textAlign="right" />
                    </View>
                  </View>
                ))}

                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>نوع المحتوى</Text>
                <View style={styles.typeRow}>
                  {(["text", "file", "video"] as const).map((t) => (
                    <TouchableOpacity key={t} style={[styles.typeBtn, { backgroundColor: contentType === t ? (contentTypeColors[t] + "20") : colors.card, borderColor: contentType === t ? (contentTypeColors[t]) : colors.border }]} onPress={() => setContentType(t)}>
                      <Text style={[styles.typeBtnText, { color: contentType === t ? contentTypeColors[t] : colors.mutedForeground }]}>{t === "text" ? "نص" : t === "file" ? "ملف" : "فيديو"}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{contentType === "text" ? "نص المحتوى" : "رابط الملف/الفيديو"}</Text>
                <View style={[styles.textAreaWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <TextInput style={[styles.textArea, { color: colors.foreground }]} value={content} onChangeText={setContent} placeholder={contentType === "text" ? "اكتب المحتوى..." : "رابط الملف أو الفيديو"} placeholderTextColor={colors.mutedForeground} multiline={contentType === "text"} numberOfLines={contentType === "text" ? 4 : 1} textAlign="right" textAlignVertical="top" />
                </View>
              </View>
            </ScrollView>
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
  thumb: { width: 60, height: 60, borderRadius: 10 },
  noImg: { backgroundColor: "#1A1A3E", justifyContent: "center", alignItems: "center" },
  info: { flex: 1, gap: 4, alignItems: "flex-end" },
  name: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  row: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  price: { fontSize: 15, fontFamily: "Inter_700Bold" },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  typeText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  qty: { fontSize: 11 },
  actions: { flexDirection: "column", gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.7)" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 20, gap: 14 },
  modalTitle: { fontSize: 17, fontFamily: "Inter_700Bold", textAlign: "right" },
  imagePick: { borderWidth: 2, borderStyle: "dashed", borderRadius: 10, height: 100, overflow: "hidden" },
  imgPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  fieldLabel: { fontSize: 12, textAlign: "right", marginBottom: 4 },
  inputRow: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  input: { fontSize: 14 },
  typeRow: { flexDirection: "row-reverse", gap: 8 },
  typeBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: "center" },
  typeBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  textAreaWrap: { borderRadius: 10, borderWidth: 1, padding: 10 },
  textArea: { fontSize: 13, minHeight: 70 },
  modalBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
});
