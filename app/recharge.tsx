import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

const PAYMENT_METHODS = [
  {
    id: "shamcash",
    name: "شام كاش",
    subtitle: "Sham Cash",
    icon: "credit-card",
    color: "#8B3DFF",
    gradientColors: ["#1A0A3A", "#0D0D2B"] as [string, string],
    logo: "💜",
    fields: [
      { label: "معرّف الحساب", value: "9685a0de3bba93e04c63396255d86de0", monospace: true },
    ],
    steps: "1. افتح تطبيق شام كاش\n2. اختر «إرسال»\n3. أدخل المعرّف أو امسح QR\n4. أدخل المبلغ وأتمّ الدفع\n5. ارفع لقطة الإيصال",
  },
  {
    id: "binance",
    name: "Binance Pay",
    subtitle: "بينانس باي",
    icon: "zap",
    color: "#F0B90B",
    gradientColors: ["#2A1E00", "#0D0D2B"] as [string, string],
    logo: "⚡",
    fields: [
      { label: "Binance ID", value: "63078113", monospace: false },
    ],
    steps: "1. افتح Binance → Pay\n2. اختر «إرسال»\n3. أدخل الـ ID أو امسح QR\n4. أدخل المبلغ بـ USDT وأتمّ\n5. ارفع صورة الإيصال",
  },
  {
    id: "usdt",
    name: "USDT TRC20",
    subtitle: "تيثر شبكة ترون",
    icon: "dollar-sign",
    color: "#00FF88",
    gradientColors: ["#00150A", "#0D0D2B"] as [string, string],
    logo: "₮",
    fields: [
      { label: "عنوان المحفظة", value: "TLqiL3ZtuCUYA78UM9HEPJZV1fAch69KKa", monospace: true },
      { label: "الشبكة", value: "TRC20 (Tron)", monospace: false },
    ],
    steps: "1. افتح محفظتك (Trust Wallet / Binance)\n2. اختر إرسال USDT شبكة TRC20\n3. الصق العنوان أو امسح QR\n4. أرسل المبلغ المطلوب\n5. ارفع لقطة التحويل",
  },
];

const AMOUNTS = [5, 10, 25, 50, 100, 200];

type Step = "choose" | "details" | "proof";

export default function RechargeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, requestRecharge } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [step, setStep] = useState<Step>("choose");
  const [selectedMethod, setSelectedMethod] = useState<(typeof PAYMENT_METHODS)[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  if (!currentUser) {
    router.replace("/login");
    return null;
  }

  const nextVip = Math.min(6, currentUser.vipLevel + 1);
  const neededForNext = nextVip * 50 - currentUser.vipTotalRecharge;

  const handleCopy = async (value: string, fieldLabel: string) => {
    await Clipboard.setStringAsync(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCopied(fieldLabel);
    setTimeout(() => setCopied(null), 2000);
  };

  const pickProof = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) setProof(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      Alert.alert("خطأ", "أدخل مبلغاً صحيحاً");
      return;
    }
    if (!proof) {
      Alert.alert("خطأ", "يرجى رفع إثبات الدفع");
      return;
    }
    setLoading(true);
    try {
      await requestRecharge(amt, proof, selectedMethod?.name ?? "");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("✅ تمّ الإرسال", "تم إرسال طلب الشحن للمراجعة. سيتم إضافة رصيدك خلال 24 ساعة.", [
        { text: "حسنًا", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const qrData = selectedMethod?.fields[0]?.value ?? "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=FFFFFF&bgcolor=0D0D2B&data=${encodeURIComponent(qrData)}`;

  return (
    <LinearGradient colors={["#070714", "#0A0620", "#070714"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[s.container, { paddingTop: topPad + 12, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={s.topRow}>
            <TouchableOpacity onPress={() => {
              if (step === "details") setStep("choose");
              else if (step === "proof") setStep("details");
              else router.back();
            }}>
              <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
            </TouchableOpacity>
            <Text style={[s.pageTitle, { color: colors.foreground }]}>شحن الرصيد</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* Balance card */}
          <LinearGradient
            colors={["#0A2A1A", "#0A0A20"]}
            style={[s.balanceCard, { borderColor: colors.neonGreen + "50" }]}
          >
            <Feather name="dollar-sign" size={24} color={colors.neonGreen} />
            <Text style={[s.balanceVal, { color: colors.neonGreen }]}>${currentUser.balance.toFixed(2)}</Text>
            <Text style={[s.balanceLbl, { color: colors.mutedForeground }]}>رصيدك الحالي</Text>
            {currentUser.vipLevel < 6 && (
              <View style={[s.vipHint, { backgroundColor: colors.neonPurple + "15", borderColor: colors.neonPurple + "40" }]}>
                <Feather name="star" size={11} color={colors.neonPurple} />
                <Text style={[s.vipHintTxt, { color: colors.neonPurple }]}>
                  شحن ${neededForNext} للوصول VIP {nextVip}
                </Text>
              </View>
            )}
          </LinearGradient>

          {/* Steps indicator */}
          <View style={s.stepsRow}>
            {(["choose", "details", "proof"] as Step[]).map((st, i) => {
              const labels = ["اختر الطريقة", "تفاصيل الدفع", "رفع الإثبات"];
              const active = step === st;
              const done = (step === "details" && i === 0) || (step === "proof" && i <= 1);
              return (
                <View key={st} style={s.stepItem}>
                  <View style={[s.stepDot, {
                    backgroundColor: done ? colors.neonGreen : active ? colors.neonPurple : colors.border,
                    borderColor: done ? colors.neonGreen : active ? colors.neonPurple : colors.border,
                  }]}>
                    {done ? (
                      <Feather name="check" size={10} color="#070714" />
                    ) : (
                      <Text style={[s.stepNum, { color: active ? "#fff" : colors.mutedForeground }]}>{i + 1}</Text>
                    )}
                  </View>
                  <Text style={[s.stepLabel, { color: active ? colors.foreground : colors.mutedForeground }]}>
                    {labels[i]}
                  </Text>
                  {i < 2 && <View style={[s.stepLine, { backgroundColor: done ? colors.neonGreen : colors.border }]} />}
                </View>
              );
            })}
          </View>

          {/* ── STEP 1: Choose method ── */}
          {step === "choose" && (
            <View style={s.methodsGrid}>
              {PAYMENT_METHODS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[s.methodCard, { borderColor: m.color + "60" }]}
                  onPress={() => { setSelectedMethod(m); setStep("details"); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
                  activeOpacity={0.8}
                >
                  <LinearGradient colors={m.gradientColors} style={s.methodCardInner}>
                    <Text style={s.methodLogo}>{m.logo}</Text>
                    <Text style={[s.methodName, { color: m.color }]}>{m.name}</Text>
                    <Text style={[s.methodSub, { color: colors.mutedForeground }]}>{m.subtitle}</Text>
                    <View style={[s.methodArrow, { backgroundColor: m.color + "20" }]}>
                      <Feather name="arrow-left" size={14} color={m.color} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── STEP 2: Payment details ── */}
          {step === "details" && selectedMethod && (
            <View style={{ gap: 14 }}>
              {/* Method header */}
              <LinearGradient
                colors={selectedMethod.gradientColors}
                style={[s.detailHeader, { borderColor: selectedMethod.color + "50" }]}
              >
                <Text style={s.detailLogo}>{selectedMethod.logo}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.detailName, { color: selectedMethod.color }]}>{selectedMethod.name}</Text>
                  <Text style={[s.detailSub, { color: colors.mutedForeground }]}>{selectedMethod.subtitle}</Text>
                </View>
              </LinearGradient>

              {/* QR Code */}
              <View style={[s.qrCard, { backgroundColor: colors.card, borderColor: selectedMethod.color + "40" }]}>
                <Text style={[s.fieldLabel, { color: colors.foreground, marginBottom: 12 }]}>امسح رمز QR للدفع</Text>
                <View style={[s.qrWrapper, { borderColor: selectedMethod.color + "60" }]}>
                  <Image
                    source={{ uri: qrUrl }}
                    style={s.qrImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Fields */}
              {selectedMethod.fields.map((field) => (
                <View key={field.label} style={[s.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[s.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
                  <View style={s.fieldRow}>
                    <TouchableOpacity
                      style={[s.copyBtn, {
                        backgroundColor: copied === field.label ? selectedMethod.color + "30" : colors.background,
                        borderColor: copied === field.label ? selectedMethod.color : colors.border,
                      }]}
                      onPress={() => handleCopy(field.value, field.label)}
                    >
                      <Feather
                        name={copied === field.label ? "check" : "copy"}
                        size={15}
                        color={copied === field.label ? selectedMethod.color : colors.mutedForeground}
                      />
                      <Text style={[s.copyTxt, { color: copied === field.label ? selectedMethod.color : colors.mutedForeground }]}>
                        {copied === field.label ? "تم النسخ" : "نسخ"}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={[s.fieldValue, {
                        color: selectedMethod.color,
                        fontFamily: field.monospace ? "Inter_400Regular" : "Inter_600SemiBold",
                        letterSpacing: field.monospace ? 0.5 : 0,
                      }]}
                      numberOfLines={2}
                      selectable
                    >
                      {field.value}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Steps */}
              <View style={[s.stepsCard, { backgroundColor: colors.card, borderColor: selectedMethod.color + "30" }]}>
                <View style={s.stepsCardHeader}>
                  <Feather name="list" size={16} color={selectedMethod.color} />
                  <Text style={[s.stepsCardTitle, { color: colors.foreground }]}>خطوات الدفع</Text>
                </View>
                <Text style={[s.stepsText, { color: colors.mutedForeground }]}>{selectedMethod.steps}</Text>
              </View>

              <TouchableOpacity
                style={[s.nextBtn, { shadowColor: selectedMethod.color }]}
                onPress={() => { setStep("proof"); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
              >
                <LinearGradient
                  colors={[selectedMethod.color, selectedMethod.color + "BB"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.nextBtnGrad}
                >
                  <Text style={s.nextBtnText}>أكملت الدفع — رفع الإثبات</Text>
                  <Feather name="arrow-left" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* ── STEP 3: Upload proof ── */}
          {step === "proof" && selectedMethod && (
            <View style={{ gap: 14 }}>
              <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[s.cardTitle, { color: colors.foreground }]}>المبلغ المُرسَل</Text>
                <View style={s.amountsGrid}>
                  {AMOUNTS.map((a) => (
                    <TouchableOpacity
                      key={a}
                      style={[s.amountBtn, {
                        backgroundColor: amount === String(a) ? selectedMethod.color + "20" : colors.background,
                        borderColor: amount === String(a) ? selectedMethod.color : colors.border,
                      }]}
                      onPress={() => setAmount(String(a))}
                    >
                      <Text style={[s.amountText, { color: amount === String(a) ? selectedMethod.color : colors.foreground }]}>
                        ${a}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.orText, { color: colors.mutedForeground }]}>أو أدخل مبلغاً مخصصاً</Text>
                <View style={[s.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[s.dollar, { color: selectedMethod.color }]}>$</Text>
                  <TextInput
                    style={[s.input, { color: colors.foreground }]}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="decimal-pad"
                    textAlign="right"
                  />
                </View>
              </View>

              <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[s.cardTitle, { color: colors.foreground }]}>صورة إثبات الدفع</Text>
                <Text style={[s.cardSub, { color: colors.mutedForeground }]}>ارفع لقطة شاشة الإيصال</Text>
                <TouchableOpacity
                  style={[s.proofBtn, { borderColor: proof ? selectedMethod.color : colors.border }]}
                  onPress={pickProof}
                >
                  {proof ? (
                    <Image source={{ uri: proof }} style={s.proofImg} resizeMode="cover" />
                  ) : (
                    <View style={s.proofPlaceholder}>
                      <Feather name="upload" size={28} color={colors.mutedForeground} />
                      <Text style={[s.proofText, { color: colors.mutedForeground }]}>اضغط لرفع الصورة</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[s.submitBtn, { shadowColor: selectedMethod.color, opacity: loading ? 0.7 : 1 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={[selectedMethod.color, selectedMethod.color + "BB"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.submitBtnGrad}
                >
                  <Feather name="send" size={18} color="#fff" />
                  <Text style={s.submitBtnText}>{loading ? "جاري الإرسال..." : "إرسال طلب الشحن"}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={[s.infoBox, { backgroundColor: colors.neonOrange + "10", borderColor: colors.neonOrange + "40" }]}>
                <Feather name="info" size={14} color={colors.neonOrange} />
                <Text style={[s.infoText, { color: colors.mutedForeground }]}>
                  سيتم مراجعة طلبك وإضافة الرصيد خلال 24 ساعة. ستصلك إشعار عند القبول أو الرفض.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 16 },
  topRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  pageTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  balanceCard: {
    borderRadius: 14, borderWidth: 1, padding: 16,
    alignItems: "center", gap: 4,
    shadowColor: "#00FF88", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  balanceVal: { fontSize: 28, fontFamily: "Inter_700Bold" },
  balanceLbl: { fontSize: 12 },
  vipHint: {
    flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1,
  },
  vipHintTxt: { fontSize: 11, fontFamily: "Inter_500Medium" },
  stepsRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 0, paddingHorizontal: 8 },
  stepItem: { flexDirection: "row-reverse", alignItems: "center", flex: 1, gap: 4 },
  stepDot: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
    alignItems: "center", justifyContent: "center",
  },
  stepNum: { fontSize: 10, fontFamily: "Inter_700Bold" },
  stepLabel: { fontSize: 10, fontFamily: "Inter_500Medium", flex: 1, textAlign: "center" },
  stepLine: { height: 1.5, flex: 0.4 },
  methodsGrid: { gap: 12 },
  methodCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  methodCardInner: { padding: 20, gap: 6 },
  methodLogo: { fontSize: 32 },
  methodName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  methodSub: { fontSize: 13 },
  methodArrow: { alignSelf: "flex-start", padding: 6, borderRadius: 8, marginTop: 4 },
  detailHeader: { borderRadius: 14, borderWidth: 1, padding: 16, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  detailLogo: { fontSize: 36 },
  detailName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  detailSub: { fontSize: 12 },
  qrCard: { borderRadius: 14, borderWidth: 1, padding: 16, alignItems: "center", gap: 0 },
  qrWrapper: { borderWidth: 2, borderRadius: 12, padding: 8, overflow: "hidden" },
  qrImage: { width: 180, height: 180 },
  fieldCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "right" },
  fieldRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  fieldValue: { flex: 1, fontSize: 13, textAlign: "right" },
  copyBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1,
  },
  copyTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  stepsCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  stepsCardHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  stepsCardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  stepsText: { fontSize: 12, lineHeight: 22, textAlign: "right" },
  nextBtn: { borderRadius: 12, overflow: "hidden", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  nextBtnGrad: { paddingVertical: 16, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10 },
  nextBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", textAlign: "right" },
  cardSub: { fontSize: 12, textAlign: "right" },
  amountsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  amountBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  amountText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  orText: { fontSize: 12, textAlign: "center" },
  inputRow: {
    flexDirection: "row-reverse", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1,
  },
  dollar: { fontSize: 18, fontFamily: "Inter_700Bold" },
  input: { flex: 1, fontSize: 18, fontFamily: "Inter_700Bold" },
  proofBtn: { borderWidth: 2, borderStyle: "dashed", borderRadius: 12, height: 140, overflow: "hidden" },
  proofImg: { width: "100%", height: "100%" },
  proofPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  proofText: { fontSize: 13 },
  submitBtn: { borderRadius: 12, overflow: "hidden", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  submitBtnGrad: { paddingVertical: 16, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10 },
  submitBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  infoBox: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 12, textAlign: "right" },
});
