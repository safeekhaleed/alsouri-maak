import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";

import { Banner } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 32;
const BANNER_HEIGHT = 180;

const PLACEHOLDER_COLORS: [string, string][] = [
  ["#1A0A40", "#0A0A20"],
  ["#0A1A40", "#0A0A20"],
  ["#0A2A1A", "#0A0A20"],
];

interface Props {
  banners: Banner[];
  localImages?: Record<string, any>;
}

export function BannerSlider({ banners, localImages = {} }: Props) {
  const colors = useColors();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const activeBanners = banners.filter((b) => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % activeBanners.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const onViewRef = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  );

  const handlePress = useCallback((link: string) => {
    if (link) Linking.openURL(link).catch(() => {});
  }, []);

  const renderBanner = useCallback(
    ({ item, index }: { item: Banner; index: number }) => {
      const placeholderColors = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];
      const localSrc = localImages[item.id];

      return (
        <TouchableOpacity
          activeOpacity={item.link ? 0.85 : 1}
          onPress={() => item.link && handlePress(item.link)}
          style={styles.bannerWrap}
        >
          <LinearGradient
            colors={placeholderColors}
            style={styles.bannerGradient}
          >
            {localSrc ? (
              <Image source={localSrc} style={styles.bannerImage} resizeMode="cover" />
            ) : item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderContent}>
                <Feather name="image" size={40} color={colors.neonPurple + "80"} />
              </View>
            )}
            <LinearGradient
              colors={["transparent", "rgba(7,7,20,0.8)"]}
              style={StyleSheet.absoluteFill}
            />
          </LinearGradient>
        </TouchableOpacity>
      );
    },
    [handlePress, localImages, colors]
  );

  if (activeBanners.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={activeBanners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + 12}
        decelerationRate="fast"
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        contentContainerStyle={{ gap: 12 }}
        inverted
      />
      <View style={styles.dots}>
        {activeBanners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === activeIndex ? colors.neonPurple : colors.border,
                width: i === activeIndex ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  bannerWrap: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#8B3DFF40",
    shadowColor: "#8B3DFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerGradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  bannerImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  placeholderContent: { alignItems: "center", justifyContent: "center", flex: 1 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 4,
  },
  dot: { height: 6, borderRadius: 3 },
});
