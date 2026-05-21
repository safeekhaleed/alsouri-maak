import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

export default function AdminNotifyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { adminSendNotification, users } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("خطأ", "اكتب العنوان والنص");
      return;
    }
    Alert.alert("إرسال إشعار", `سيصل لـ ${users.length} مستخدم`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "إرسال",
        onPress: async () => {
          setLoading(true);
          try {
            await adminSendNotification(title.trim(), body.trim());
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("تمّ", "تم إرسال الإشعار لجميع المستخدمين");
            setTitle("");
            setBody("");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={["#0D0D2B", "#070714"]} style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>إرسال إشعار</Text>
        <View style={{ width: 22 }} />
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={["#0A1A40", "#0A0A20"]} style={[styles.infoCard, { borderColor: colors.neonBlue + "40" }]}>
            <Feather name="bell" size={24} color={colors.neonBlue} />
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={[styles.infoTitle, { color: colors.foreground }]}>إشعار لجميع المستخدمين</Text>
              <Text style={[styles.infoSub, { color: colors.mutedForeground }]}>سيصل لـ {users.length} مستخدم مسجّل</Text>
            </View>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>عنوان الإشعار</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={title}
                onChangeText={setTitle}
                placeholder="عنوان الإشعار"
                placeholderTextColor={colors.mutedForeground}
                textAlign="right"
                maxLength={60}
              />
            </View>

            <Text style={[styles.label, { color: colors.mutedForeground, marginTop: 8 }]}>نص الإشعار</Text>
            <View style={[styles.textAreaWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textArea, { color: colors.foreground }]}
                value={body}
                onChangeText={setBody}
                placeholder="اكتب نص الإشعار هنا..."
                placeholderTextColor={colors.mutedForeground}
                textAlign="right"
                multiline
                numberOfLines={5}
                maxLength={300}
              />
            </View>
            <Text style={[styles.charCount, { color: colors.mutedForeground }]}>{body.length}/300</Text>
          </View>

          <TouchableOpacity
            style={[styles.sendBtn, { shadowColor: colors.neonBlue, opacity: loading ? 0.7 : 1 }]}
            onPress={handleSend}
            disabled={loading}
          >
            <LinearGradient colors={["#00BFFF", "#0060A0"]} style={styles.sendBtnGrad}>
              <Feather name="send" size={18} color="#fff" />
              <Text style={styles.sendBtnText}>إرسال الإشعار</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  content: { padding: 16, gap: 16 },
  infoCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 16, borderRadius: 14, borderWidth: 1 },
  infoTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  infoSub: { fontSize: 12, marginTop: 2 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  label: { fontSize: 13, textAlign: "right" },
  inputRow: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
  input: { fontSize: 14 },
  textAreaWrap: { borderRadius: 10, borderWidth: 1, padding: 12 },
  textArea: { fontSize: 14, textAlignVertical: "top", minHeight: 100 },
  charCount: { fontSize: 11, textAlign: "left" },
  sendBtn: {
    borderRadius: 12, overflow: "hidden",
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  sendBtnGrad: { flexDirection: "row-reverse", paddingVertical: 16, alignItems: "center", justifyContent: "center", gap: 10 },
  sendBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
