import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BannerSlider } from "@/components/BannerSlider";
import { StatsCard } from "@/components/StatsCard";
import { ToolCard } from "@/components/ToolCard";
import { Tool } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const bannerImages: Record<string, any> = {
  b1: require("@/assets/images/banner1.png"),
  b2: require("@/assets/images/banner2.png"),
  b3: require("@/assets/images/banner3.png"),
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { banners, tools, users, setDrawerOpen } = useApp();

  const activeTools = tools.filter((t) => t.isActive).slice(0, 4);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleToolPress = (tool: Tool) => {
    router.push({ pathname: "/webview", params: { url: tool.url, title: tool.name } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={["#0D0D2B", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity
          style={[styles.menuBtn, { borderColor: colors.neonPurple + "60", backgroundColor: colors.neonPurple + "15", shadowColor: colors.neonPurple }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setDrawerOpen(true);
          }}
        >
          <Feather name="menu" size={20} color={colors.neonPurple} />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={[styles.appName, { color: colors.neonOrange }]}>السوري معك</Text>
          <Text style={[styles.appSubtitle, { color: colors.mutedForeground }]}>منصتك الذكية</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 100 : 80 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Slider */}
        <BannerSlider banners={banners} localImages={bannerImages} />

        {/* Tools Section */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.neonPurple }]} />
          <View style={styles.sectionTitles}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>أدواتي التفاعلية</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
              أدوات ذكية لتسهيل مهامك اليومية
            </Text>
          </View>
        </View>

        <View style={styles.toolsGrid}>
          {activeTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onPress={handleToolPress} />
          ))}
          {activeTools.length === 0 && (
            <View style={styles.emptyTools}>
              <Feather name="grid" size={32} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد أدوات متاحة</Text>
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.neonBlue }]} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>إحصائيات المنصة</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            icon="users"
            value={`${(users.length * 125).toLocaleString()}+`}
            label="المستخدمين"
            color={colors.neonPurple}
            bgColor={["#1A0A40", "#0A0A20"]}
            delay={0}
          />
          <StatsCard
            icon="layers"
            value={`${tools.length * 57}+`}
            label="الأدوات"
            color={colors.neonBlue}
            bgColor={["#0A1A40", "#0A0A20"]}
            delay={100}
          />
          <StatsCard
            icon="shield"
            value="98%"
            label="موثوقية"
            color={colors.neonGreen}
            bgColor={["#0A2A1A", "#0A0A20"]}
            delay={200}
          />
          <StatsCard
            icon="trending-up"
            value="24/7"
            label="متاح دائمًا"
            color={colors.neonOrange}
            bgColor={["#2A1A0A", "#0A0A20"]}
            delay={300}
          />
        </View>
      </ScrollView>
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
  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: { alignItems: "flex-end" },
  appName: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "right" },
  appSubtitle: { fontSize: 12, textAlign: "right" },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 20 },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  sectionAccent: { width: 4, height: 28, borderRadius: 2 },
  sectionTitles: { alignItems: "flex-end" },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  sectionSubtitle: { fontSize: 12, textAlign: "right", marginTop: 2 },
  toolsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  emptyTools: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
  emptyText: { fontSize: 14, textAlign: "center" },
  statsGrid: { flexDirection: "row-reverse", gap: 8 },
});
