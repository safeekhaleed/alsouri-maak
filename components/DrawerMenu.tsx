import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(width * 0.82, 320);

interface DrawerItem {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

export function DrawerMenu() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, drawerOpen, setDrawerOpen, logout } = useApp();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (drawerOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: -DRAWER_WIDTH, useNativeDriver: true, tension: 100, friction: 15 }),
        Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [drawerOpen]);

  const close = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDrawerOpen(false);
  };

  const navigate = (path: string) => {
    close();
    setTimeout(() => router.push(path as any), 200);
  };

  const menuItems: DrawerItem[] = [
    { icon: "user", label: "تعديل الملف الشخصي", onPress: () => navigate("/profile"), color: colors.neonPurple },
    { icon: "settings", label: "إعدادات الحساب", onPress: () => navigate("/profile"), color: colors.neonBlue },
    { icon: "dollar-sign", label: "شحن الرصيد", onPress: () => navigate("/recharge"), color: colors.neonGreen },
    { icon: "shopping-bag", label: "مشترياتي", onPress: () => navigate("/purchases"), color: colors.neonOrange },
    { icon: "bell", label: "الإشعارات", onPress: () => navigate("/notifications"), color: colors.neonPink },
    {
      icon: "send",
      label: "تواصل معنا",
      onPress: () => {
        close();
        Linking.openURL("https://t.me/alsouri").catch(() => {});
      },
      color: colors.neonBlue,
    },
  ];

  if (currentUser?.isAdmin) {
    menuItems.push({
      icon: "shield",
      label: "لوحة الأدمن",
      onPress: () => navigate("/admin"),
      color: colors.neonOrange,
    });
  }

  const vipColors: Record<number, string> = {
    0: colors.mutedForeground,
    1: "#C0C0C0",
    2: "#FFD700",
    3: "#00BFFF",
    4: "#8B3DFF",
    5: "#FF8C00",
    6: "#FF00FF",
  };

  if (!drawerOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close}>
          {Platform.OS === "ios" ? (
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.6)" }]} />
          )}
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          { right: 0, transform: [{ translateX: slideAnim.interpolate({ inputRange: [-DRAWER_WIDTH, 0], outputRange: [DRAWER_WIDTH, 0] }) }] },
        ]}
      >
        <LinearGradient
          colors={["#0D0D2B", "#070714"]}
          style={[styles.drawerInner, { paddingTop: insets.top + 12 }]}
        >
          <View style={[styles.borderGlow, { borderColor: colors.neonPurple + "40" }]} />

          {/* Header */}
          <TouchableOpacity style={styles.closeBtn} onPress={close}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* User Profile */}
          {currentUser ? (
            <View style={styles.profileSection}>
              <View style={[styles.avatar, { borderColor: vipColors[currentUser.vipLevel] ?? colors.border }]}>
                {currentUser.avatarUrl ? (
                  <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarImg} />
                ) : (
                  <LinearGradient colors={["#2A0A50", "#0A0A30"]} style={styles.avatarImg}>
                    <Text style={styles.avatarInitial}>{currentUser.name.charAt(0)}</Text>
                  </LinearGradient>
                )}
              </View>

              <Text style={[styles.userName, { color: colors.foreground }]}>{currentUser.name}</Text>
              <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>{currentUser.email}</Text>

              <View style={styles.statsRow}>
                <View style={[styles.statBox, { borderColor: colors.neonGreen + "40", backgroundColor: colors.neonGreen + "10" }]}>
                  <Text style={[styles.statVal, { color: colors.neonGreen }]}>${currentUser.balance.toFixed(2)}</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>الرصيد</Text>
                </View>
                {currentUser.vipLevel > 0 && (
                  <View style={[styles.statBox, { borderColor: (vipColors[currentUser.vipLevel] ?? colors.border) + "40", backgroundColor: (vipColors[currentUser.vipLevel] ?? colors.border) + "10" }]}>
                    <Text style={[styles.statVal, { color: vipColors[currentUser.vipLevel] ?? colors.mutedForeground }]}>
                      VIP {currentUser.vipLevel}
                    </Text>
                    <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>خصم {currentUser.vipLevel * 5}%</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.authSection}>
              <TouchableOpacity
                style={[styles.authBtn, { backgroundColor: colors.neonPurple, shadowColor: colors.neonPurple }]}
                onPress={() => navigate("/login")}
              >
                <Text style={styles.authBtnText}>تسجيل الدخول</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Menu Items */}
          <View style={styles.menuItems}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: (item.color ?? colors.neonPurple) + "15", borderColor: (item.color ?? colors.neonPurple) + "40" }]}>
                  <Feather name={item.icon as any} size={16} color={item.color ?? colors.neonPurple} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flex: 1 }} />

          {currentUser && (
            <TouchableOpacity
              style={[styles.logoutBtn, { borderColor: colors.destructive + "50" }]}
              onPress={async () => {
                close();
                await logout();
                router.replace("/login");
              }}
            >
              <Feather name="log-out" size={16} color={colors.destructive} />
              <Text style={[styles.logoutText, { color: colors.destructive }]}>تسجيل الخروج</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: insets.bottom + 16 }} />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
  },
  drawerInner: { flex: 1, paddingHorizontal: 20 },
  borderGlow: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 1,
    borderLeftWidth: 1,
  },
  closeBtn: { alignSelf: "flex-start", padding: 4, marginBottom: 16 },
  profileSection: { alignItems: "center", gap: 6, marginBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontSize: 28, color: "#fff", fontFamily: "Inter_700Bold" },
  userName: { fontSize: 17, fontFamily: "Inter_700Bold", textAlign: "center" },
  userEmail: { fontSize: 12, textAlign: "center" },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  statBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
  },
  statVal: { fontSize: 14, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 10, fontFamily: "Inter_400Regular" },
  authSection: { marginBottom: 16 },
  authBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  authBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  divider: { height: 1, marginVertical: 12 },
  menuItems: { gap: 2 },
  menuItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1, textAlign: "right" },
  logoutBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  logoutText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
