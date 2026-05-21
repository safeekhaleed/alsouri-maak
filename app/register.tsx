import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول");
      return;
    }
    if (password.length < 6) {
      Alert.alert("خطأ", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      const ok = await register(email.trim(), password, name.trim());
      if (ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      } else {
        Alert.alert("خطأ", "البريد الإلكتروني مستخدم بالفعل");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#070714", "#0D0D2B", "#070714"]} style={styles.gradient}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: topPad + 20, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
          </TouchableOpacity>

          <View style={styles.logoSection}>
            <LinearGradient colors={["#00BFFF", "#0A5080"]} style={[styles.logoCircle, { shadowColor: colors.neonBlue }]}>
              <Feather name="user-plus" size={32} color="#fff" />
            </LinearGradient>
            <Text style={[styles.title, { color: colors.foreground }]}>إنشاء حساب</Text>
            <Text style={[styles.subText, { color: colors.mutedForeground }]}>انضم إلى منصة السوري معك</Text>
          </View>

          <View style={styles.form}>
            {[
              { label: "الاسم الكامل", value: name, onChange: setName, icon: "user", placeholder: "أدخل اسمك", secure: false },
              { label: "البريد الإلكتروني", value: email, onChange: setEmail, icon: "mail", placeholder: "أدخل بريدك الإلكتروني", secure: false },
            ].map((field, i) => (
              <View key={i} style={styles.inputWrap}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
                <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name={field.icon as any} size={16} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    value={field.value}
                    onChangeText={field.onChange}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.mutedForeground}
                    autoCapitalize="none"
                    textAlign="right"
                  />
                </View>
              </View>
            ))}

            <View style={styles.inputWrap}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>كلمة المرور</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Feather name={showPass ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPass}
                  textAlign="right"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btn, { shadowColor: colors.neonBlue }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient colors={["#00BFFF", "#0A6090"]} style={styles.btnGrad}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>إنشاء الحساب</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push("/login")}>
              <Text style={[styles.loginText, { color: colors.mutedForeground }]}>
                لديك حساب؟{" "}
                <Text style={{ color: colors.neonBlue, fontFamily: "Inter_600SemiBold" }}>تسجيل الدخول</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { paddingHorizontal: 24 },
  backBtn: { alignSelf: "flex-end", padding: 8, marginBottom: 8 },
  logoSection: { alignItems: "center", marginBottom: 32, gap: 8 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 8,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subText: { fontSize: 14 },
  form: { gap: 16 },
  inputWrap: { gap: 6 },
  inputLabel: { fontSize: 13, textAlign: "right" },
  inputRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: 14 },
  btn: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  btnGrad: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  loginLink: { alignItems: "center" },
  loginText: { fontSize: 14, textAlign: "center" },
});
