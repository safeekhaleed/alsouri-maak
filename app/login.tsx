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

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول");
      return;
    }
    setLoading(true);
    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("خطأ", "البريد الإلكتروني أو كلمة المرور غير صحيحة");
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

          {/* Logo area */}
          <View style={styles.logoSection}>
            <LinearGradient
              colors={["#8B3DFF", "#4A0DB0"]}
              style={[styles.logoCircle, { shadowColor: colors.neonPurple }]}
            >
              <Feather name="zap" size={36} color="#fff" />
            </LinearGradient>
            <Text style={[styles.appName, { color: colors.neonOrange }]}>السوري معك</Text>
            <Text style={[styles.welcomeText, { color: colors.foreground }]}>مرحباً بعودتك</Text>
            <Text style={[styles.subText, { color: colors.mutedForeground }]}>تسجيل الدخول إلى حسابك</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>البريد الإلكتروني</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="mail" size={16} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="أدخل بريدك الإلكتروني"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="right"
                />
              </View>
            </View>

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
                  placeholder="أدخل كلمة المرور"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPass}
                  textAlign="right"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, { shadowColor: colors.neonPurple }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient colors={["#8B3DFF", "#5A1DB0"]} style={styles.loginBtnGrad}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => router.push("/register")}>
              <Text style={[styles.registerText, { color: colors.mutedForeground }]}>
                ليس لديك حساب؟{" "}
                <Text style={{ color: colors.neonPurple, fontFamily: "Inter_600SemiBold" }}>
                  إنشاء حساب
                </Text>
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
  logoSection: { alignItems: "center", marginBottom: 40, gap: 8 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 8,
  },
  appName: { fontSize: 24, fontFamily: "Inter_700Bold" },
  welcomeText: { fontSize: 20, fontFamily: "Inter_700Bold", marginTop: 4 },
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
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  loginBtn: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnGrad: { paddingVertical: 16, alignItems: "center", borderRadius: 12 },
  loginBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  registerLink: { alignItems: "center", marginTop: 8 },
  registerText: { fontSize: 14, textAlign: "center" },
});
