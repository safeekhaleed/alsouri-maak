import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, updateProfile } = useApp();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("إذن مطلوب", "يجب السماح بالوصول للصور");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await updateProfile({ avatarUrl: result.assets[0].uri });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("خطأ", "الاسم لا يمكن أن يكون فارغاً");
      return;
    }
    setLoading(true);
    try {
      const updates: any = { name: name.trim(), email: email.trim() };
      if (password.trim().length >= 6) updates.password = password;
      else if (password.trim().length > 0 && password.trim().length < 6) {
        Alert.alert("خطأ", "كلمة المرور يجب 6 أحرف على الأقل");
        return;
      }
      await updateProfile(updates);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("تمّ", "تم تحديث الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    router.replace("/login");
    return null;
  }

  const vipColors: Record<number, string> = {
    0: colors.mutedForeground, 1: "#C0C0C0", 2: "#FFD700",
    3: "#00BFFF", 4: "#8B3DFF", 5: "#FF8C00", 6: "#FF00FF",
  };

  return (
    <LinearGradient colors={["#070714", "#0D0D2B", "#070714"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: topPad + 12, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
            </TouchableOpacity>
            <Text style={[styles.pageTitle, { color: colors.foreground }]}>الملف الشخصي</Text>
            <View style={{ width: 22 }} />
          </View>

          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage}>
              <View style={[styles.avatar, { borderColor: vipColors[currentUser.vipLevel] ?? colors.border }]}>
                {currentUser.avatarUrl ? (
                  <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarImg} />
                ) : (
                  <LinearGradient colors={["#2A0A50", "#0A0A30"]} style={styles.avatarImg}>
                    <Text style={styles.avatarInitial}>{currentUser.name.charAt(0)}</Text>
                  </LinearGradient>
                )}
                <View style={[styles.editBadge, { backgroundColor: colors.neonPurple }]}>
                  <Feather name="camera" size={12} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>

            {currentUser.vipLevel > 0 && (
              <View style={[styles.vipBadge, { borderColor: vipColors[currentUser.vipLevel], backgroundColor: (vipColors[currentUser.vipLevel] ?? colors.border) + "20" }]}>
                <Feather name="star" size={12} color={vipColors[currentUser.vipLevel]} />
                <Text style={[styles.vipText, { color: vipColors[currentUser.vipLevel] }]}>
                  VIP {currentUser.vipLevel} — خصم {currentUser.vipLevel * 5}%
                </Text>
              </View>
            )}

            <View style={styles.balanceRow}>
              <View style={[styles.balanceBox, { backgroundColor: colors.neonGreen + "15", borderColor: colors.neonGreen + "40" }]}>
                <Text style={[styles.balanceVal, { color: colors.neonGreen }]}>${currentUser.balance.toFixed(2)}</Text>
                <Text style={[styles.balanceLbl, { color: colors.mutedForeground }]}>الرصيد الحالي</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>معلومات الحساب</Text>

            {[
              { label: "الاسم الكامل", value: name, onChange: setName, icon: "user", secure: false },
              { label: "البريد الإلكتروني", value: email, onChange: setEmail, icon: "mail", secure: false },
              { label: "كلمة المرور الجديدة (اختياري)", value: password, onChange: setPassword, icon: "lock", secure: true },
            ].map((field, i) => (
              <View key={i} style={styles.inputWrap}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
                <View style={[styles.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Feather name={field.icon as any} size={16} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    value={field.value}
                    onChangeText={field.onChange}
                    secureTextEntry={field.secure}
                    textAlign="right"
                    placeholderTextColor={colors.mutedForeground}
                    placeholder={field.secure ? "اتركه فارغاً إن لم تريد التغيير" : ""}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.saveBtn, { shadowColor: colors.neonPurple }]}
              onPress={handleSave}
              disabled={loading}
            >
              <LinearGradient colors={["#8B3DFF", "#5A1DB0"]} style={styles.saveBtnGrad}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>حفظ التغييرات</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 20 },
  topRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  pageTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  avatarSection: { alignItems: "center", gap: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, overflow: "hidden" },
  avatarImg: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  avatarInitial: { fontSize: 32, color: "#fff", fontFamily: "Inter_700Bold" },
  editBadge: {
    position: "absolute", bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13, justifyContent: "center", alignItems: "center",
  },
  vipBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
  },
  vipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  balanceRow: { width: "100%" },
  balanceBox: {
    alignItems: "center", padding: 14, borderRadius: 12, borderWidth: 1,
  },
  balanceVal: { fontSize: 24, fontFamily: "Inter_700Bold" },
  balanceLbl: { fontSize: 12, marginTop: 2 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", textAlign: "right" },
  inputWrap: { gap: 6 },
  inputLabel: { fontSize: 13, textAlign: "right" },
  inputRow: {
    flexDirection: "row-reverse", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 13, borderRadius: 10, borderWidth: 1,
  },
  input: { flex: 1, fontSize: 14 },
  saveBtn: {
    borderRadius: 12, overflow: "hidden", marginTop: 4,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 6,
  },
  saveBtnGrad: { paddingVertical: 14, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
});
