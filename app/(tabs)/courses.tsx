import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CourseCard } from "@/components/CourseCard";
import { Course } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function CoursesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { courses, currentUser, buyCourse } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const activeCourses = courses.filter((c) => c.isActive);

  const handleBuy = async (course: Course) => {
    if (!currentUser) {
      Alert.alert("تسجيل الدخول مطلوب", "يجب تسجيل الدخول للاشتراك", [
        { text: "إلغاء", style: "cancel" },
        { text: "تسجيل الدخول", onPress: () => router.push("/login") },
      ]);
      return;
    }

    const finalPrice = course.price * (1 - currentUser.vipLevel * 0.05);
    if (currentUser.balance < finalPrice) {
      Alert.alert("رصيد غير كافٍ", `المطلوب $${finalPrice.toFixed(2)}`, [
        { text: "شحن الرصيد", onPress: () => router.push("/recharge") },
        { text: "إلغاء", style: "cancel" },
      ]);
      return;
    }

    Alert.alert("تأكيد الاشتراك", `اشترك في "${course.name}" بـ $${finalPrice.toFixed(2)}؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "اشترك",
        onPress: async () => {
          const ok = await buyCourse(course);
          if (ok) Alert.alert("تمّ الاشتراك", "تم إضافة الكورس لمشترياتك");
          else Alert.alert("خطأ", "حدث خطأ");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0A0A2B", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <Feather name="book-open" size={22} color={colors.neonBlue} />
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الكورسات</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {activeCourses.length} كورس متاح
          </Text>
        </View>
        <View style={[styles.headerAccent, { backgroundColor: colors.neonBlue }]} />
      </LinearGradient>

      {currentUser && currentUser.vipLevel > 0 && (
        <View style={[styles.vipBanner, { backgroundColor: colors.neonBlue + "15", borderColor: colors.neonBlue + "40" }]}>
          <Feather name="star" size={14} color={colors.neonBlue} />
          <Text style={[styles.vipText, { color: colors.neonBlue }]}>
            خصم VIP {currentUser.vipLevel * 5}% مطبّق تلقائيًا
          </Text>
        </View>
      )}

      <FlatList
        data={activeCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard course={item} onBuy={handleBuy} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 100 : 80 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="book" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد كورسات حالياً</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerAccent: { width: 4, height: 28, borderRadius: 2 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "right" },
  headerSub: { fontSize: 12, textAlign: "right" },
  vipBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  vipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { padding: 16 },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, textAlign: "center" },
});
