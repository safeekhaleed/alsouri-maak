import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ToolCard } from "@/components/ToolCard";
import { Tool } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ToolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tools } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const activeTools = tools.filter((t) => t.isActive);

  const handleToolPress = (tool: Tool) => {
    router.push({ pathname: "/webview", params: { url: tool.url, title: tool.name } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0D0D2B", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <View style={[styles.headerAccent, { backgroundColor: colors.neonOrange }]} />
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الأدوات</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {activeTools.length} أداة تفاعلية
          </Text>
        </View>
        <Feather name="grid" size={22} color={colors.neonOrange} />
      </LinearGradient>

      <FlatList
        data={activeTools}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.toolWrap}>
            <ToolCard tool={item} onPress={handleToolPress} />
          </View>
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 100 : 80 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="grid" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد أدوات حالياً</Text>
          </View>
        }
        columnWrapperStyle={styles.columnWrapper}
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
  list: { padding: 12 },
  columnWrapper: { gap: 0 },
  toolWrap: { flex: 1, padding: 4 },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, textAlign: "center" },
});
