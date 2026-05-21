import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.neonPurple,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === "web" ? 84 : 64,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["rgba(13,13,43,0.97)", "rgba(7,7,20,0.99)"]}
            style={[
              StyleSheet.absoluteFill,
              {
                borderTopWidth: 1,
                borderTopColor: colors.neonPurple + "30",
              },
            ]}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium",
          marginBottom: Platform.OS === "ios" ? 0 : 6,
        },
        tabBarIconStyle: { marginTop: Platform.OS === "ios" ? 0 : 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activeIcon, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple + "50" }] : undefined}>
              <Feather name="home" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "المتجر",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activeIcon, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple + "50" }] : undefined}>
              <Feather name="shopping-bag" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "الدروس",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activeIcon, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple + "50" }] : undefined}>
              <Feather name="book-open" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "الأدوات",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activeIcon, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple + "50" }] : undefined}>
              <Feather name="grid" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "الخدمات",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activeIcon, { backgroundColor: colors.neonPurple + "20", borderColor: colors.neonPurple + "50" }] : undefined}>
              <Feather name="headphones" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
