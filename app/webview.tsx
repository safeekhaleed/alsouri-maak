import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { useColors } from "@/hooks/useColors";

export default function WebViewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webRef = useRef<WebView>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={["#0D0D2B", "#070714"]}
          style={[styles.header, { paddingTop: topPad + 12 }]}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-right" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
        <View style={styles.webFallback}>
          <Feather name="external-link" size={40} color={colors.neonPurple} />
          <Text style={[styles.fallbackText, { color: colors.foreground }]}>افتح الرابط</Text>
          <TouchableOpacity
            style={[styles.openBtn, { backgroundColor: colors.neonPurple }]}
            onPress={() => Linking.openURL(url ?? "")}
          >
            <Text style={styles.openBtnText}>فتح في المتصفح</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0D0D2B", "#070714"]}
        style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-right" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.navBtns}>
          {canGoBack && (
            <TouchableOpacity onPress={() => webRef.current?.goBack()}>
              <Feather name="chevron-right" size={22} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {loading && (
        <View style={[styles.loader, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.neonPurple} />
          <Text style={[styles.loaderText, { color: colors.mutedForeground }]}>جاري التحميل...</Text>
        </View>
      )}

      <WebView
        ref={webRef}
        source={{ uri: url ?? "https://google.com" }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        userAgent="Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36"
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
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  title: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  navBtns: { flexDirection: "row", gap: 4, width: 40, justifyContent: "flex-end" },
  webview: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    zIndex: 10,
    top: 70,
  },
  loaderText: { fontSize: 14 },
  webFallback: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  fallbackText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  openBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  openBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
