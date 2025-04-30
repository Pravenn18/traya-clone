import { setReelPlay } from "@/data/atom";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
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

const { width, height } = Dimensions.get("window");

const videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / height);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={({ item, index }) => (
          <VideoItem uri={item} isActive={index === currentIndex} />
        )}
        keyExtractor={(item) => item}
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
      />
    </View>
  );
}

const VideoItem = ({ uri, isActive }: { uri: string; isActive: boolean }) => {
  const playerRef = useRef<any>(null);
  const [paused, setPaused] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  //TODO: remove unused atom and make reels more smoother and optimised
  const [, shouldReelPlay] = useAtom(setReelPlay);

  const isScreenFocused = useIsFocused();

  useEffect(() => {
    setPaused(!(isActive && isScreenFocused));
  }, [isActive, isScreenFocused]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && isActive && isScreenFocused) {
        setPaused(false);
      }
    });
    return () => sub.remove();
  }, [isActive, isScreenFocused]);

  return (
    <Pressable
      onPress={() => setPaused((prev) => !prev)}
      style={styles.videoContainer}
    >
      <Video
        source={{ uri }}
        ref={playerRef}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={paused}
        onLoadStart={() => setIsBuffering(true)}
        onReadyForDisplay={() => setIsBuffering(false)}
        onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
      />
      {isBuffering && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
          <Text style={{ fontWeight: "bold" }}>Traya. </Text>
          Yaseen lost his hair at 19. What happened next?
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

// i am trting to make this kind of scrolling, i want to achieve it using react natiev videos instead of expo av
// import {
//   View,
//   Dimensions,
//   FlatList,
//   StyleSheet,
//   Pressable,
// } from "react-native";
// import { Video, ResizeMode } from "expo-av";
// import React, { useEffect, useRef, useState } from "react";

// const videos = [
//   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
//   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
// ];

// export default function VideosScreen() {
//   const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
//   const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
//   const onViewableItemsChanged = ({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
//     }
//   };
//   const viewabilityConfigCallbackPairs = useRef([
//     { viewabilityConfig, onViewableItemsChanged },
//   ]);
//   return (

//        (

//         )}
//         keyExtractor={(item) => item}
//         pagingEnabled
//         horizontal={false}
//         showsVerticalScrollIndicator={false}
//         viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
//       />

//   );
// }

// const Item = ({ item, shouldPlay }: { shouldPlay: boolean; item: string }) => {
//   const video = React.useRef(null);
//   const [status, setStatus] = useState(null);

//   useEffect(() => {
//     if (!video.current) return;

//     if (shouldPlay) {
//       video.current.playAsync();
//     } else {
//       video.current.pauseAsync();
//       video.current.setPositionAsync(0);
//     }
//   }, [shouldPlay]);

//   return (

//         status.isPlaying
//           ? video.current?.pauseAsync()
//           : video.current?.playAsync()
//       }
//     >

//          setStatus(() => status)}
//         />

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   videoContainer: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
//   video: {
//     width: "100%",
//     height: "100%",
//   },
// });
