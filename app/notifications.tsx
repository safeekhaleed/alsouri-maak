import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNotification } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, notifications, markNotificationRead } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const myNotifs = notifications
    .filter((n) => n.userId === null || n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = myNotifs.filter((n) => !n.isRead).length;

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity onPress={() => markNotificationRead(item.id)}>
      <LinearGradient
        colors={item.isRead ? ["#0A0A20", "#0A0A20"] : ["#1A0A40", "#0A0A20"]}
        style={[
          styles.item,
          {
            borderColor: item.isRead ? colors.border : colors.neonPurple + "50",
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.neonPurple + "15", borderColor: colors.neonPurple + "40" }]}>
          <Feather name="bell" size={18} color={colors.neonPurple} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>{item.body}</Text>
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            {new Date(item.createdAt).toLocaleDateString("ar-SA")}
          </Text>
        </View>
        {!item.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: colors.neonPurple }]} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0D0D2B", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الإشعارات</Text>
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.neonPurple }]}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
        {unreadCount === 0 && <View style={{ width: 30 }} />}
      </LinearGradient>

      <FlatList
        data={myNotifs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bell-off" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>لا توجد إشعارات</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  badge: {
    width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  list: { padding: 16, gap: 8 },
  item: {
    flexDirection: "row-reverse", alignItems: "flex-start", gap: 12,
    padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 10, borderWidth: 1,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
  },
  content: { flex: 1, gap: 4, alignItems: "flex-end" },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  body: { fontSize: 12, textAlign: "right", lineHeight: 18 },
  date: { fontSize: 10 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, textAlign: "center" },
});
