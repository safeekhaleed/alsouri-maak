import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { I18nManager, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DrawerMenu } from "@/components/DrawerMenu";
import { AppProvider } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colors = useColors();
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="register" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="webview" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="recharge" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="purchases" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="notifications" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="admin/index" options={{ headerShown: false }} />
        <Stack.Screen name="admin/banners" options={{ headerShown: false }} />
        <Stack.Screen name="admin/users" options={{ headerShown: false }} />
        <Stack.Screen name="admin/products" options={{ headerShown: false }} />
        <Stack.Screen name="admin/courses" options={{ headerShown: false }} />
        <Stack.Screen name="admin/services" options={{ headerShown: false }} />
        <Stack.Screen name="admin/tools" options={{ headerShown: false }} />
        <Stack.Screen name="admin/recharge" options={{ headerShown: false }} />
        <Stack.Screen name="admin/notify" options={{ headerShown: false }} />
      </Stack>
      <DrawerMenu />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
