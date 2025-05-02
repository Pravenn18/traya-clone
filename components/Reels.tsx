// Reels.tsx
import { setReelPlay } from "@/data/atom";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { BackHandler } from "react-native";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Dimensions,
  Image,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  AppState,
  ActivityIndicator,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Video from "react-native-video";
import { videoSections } from "@/constants/Data";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function Reels() {
  useEffect(() => {
    const handleBackPress = () => {
      // Ensure all videos are paused before navigating back
      setCurrentIndex(-1); // This will cause all videos to pause
      setTimeout(() => router.back(), 50);
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, []);

  const params = useLocalSearchParams();
  const sectionIndex = Number(params.sectionIndex || 0);
  const videoIndex = Number(params.videoIndex || 0);

  const [flattenedVideos, setFlattenedVideos] = useState([]);
  const [initialScrollIndex, setInitialScrollIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const videos = [];
    let startIndex = 0;

    if (videoSections[sectionIndex]) {
      videos.push(...videoSections[sectionIndex].videos);
      startIndex = videoIndex;
    }

    setFlattenedVideos(videos);
    setInitialScrollIndex(startIndex);
    setCurrentIndex(startIndex);
    setLoading(false);
  }, [sectionIndex, videoIndex]);

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / height);
    setCurrentIndex(newIndex);
  };

  // Scroll to initial position after loading
  useEffect(() => {
    if (!loading && flatListRef.current && initialScrollIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: initialScrollIndex,
        animated: false,
      });
    }
  }, [loading, initialScrollIndex]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={flattenedVideos}
        renderItem={({ item, index }) => (
          <VideoItem video={item} isActive={index === currentIndex} />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          });
        }}
      />
    </SafeAreaView>
  );
}

const VideoItem = ({ video, isActive }) => {
  const playerRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [, shouldReelPlay] = useAtom(setReelPlay);
  const isScreenFocused = useIsFocused();

  useEffect(() => {
    setPaused(!(isActive && isScreenFocused));

    if (!isScreenFocused) {
      setPaused(true);
    }
  }, [isActive, isScreenFocused]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && isActive && isScreenFocused) {
        setPaused(false);
      } else if (state !== "active") {
        setPaused(true);
      }
    });
    return () => sub.remove();
  }, [isActive, isScreenFocused]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        setPaused(true);
      }
    };
  }, []);

  return (
    <Pressable
      onPress={() => setPaused((prev) => !prev)}
      style={styles.videoContainer}
    >
      <Video
        source={{ uri: video.url }}
        ref={playerRef}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={paused}
        onLoadStart={() => setIsBuffering(true)}
        onReadyForDisplay={() => setIsBuffering(false)}
        onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
        playInBackground={false}
        playWhenInactive={false}
      />
      {isBuffering && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          // Ensure video is paused before navigation
          setPaused(true);
          setTimeout(() => router.back(), 50);
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>{"←"}</Text>
      </TouchableOpacity>
      <View style={styles.rightOverlay}>
        <TouchableOpacity style={styles.iconButton}>
          <Text>👍</Text>
          <Text style={styles.label}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text>👎</Text>
          <Text style={styles.label}>Dislike</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text>🔁</Text>
          <Text style={styles.label}>Remix</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomDescription}>
        <Image
          source={{ uri: "https://your-profile-url.png" }}
          style={styles.avatar}
        />
        <Text style={styles.caption}>
          <Text style={{ fontWeight: "bold" }}>{video.title} </Text>
          {video.description || "Video description goes here"}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 2,
  },
  rightOverlay: {
    position: "absolute",
    right: 16,
    top: height / 3,
    alignItems: "center",
    zIndex: 2,
  },
  iconButton: {
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 12,
  },
  bottomDescription: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  caption: {
    color: "white",
    fontSize: 14,
    flex: 1,
  },
  videoContainer: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    alignSelf: "center",
  },
});
