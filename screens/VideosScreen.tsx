import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { videoSections } from "@/constants/Data";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideosScreen() {
  const navigateToReel = (sectionIndex, videoIndex) => {
    router.push({
      pathname: "/(stack)/reel",
      params: { sectionIndex, videoIndex },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Videos</Text>
      <FlatList
        data={videoSections}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item, index: sectionIndex }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              data={item.videos}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(video) => video.id}
              renderItem={({ item: video, index: videoIndex }) => (
                <TouchableOpacity
                  style={styles.videoCard}
                  onPress={() => navigateToReel(sectionIndex, videoIndex)}
                >
                  <View style={styles.thumbnailContainer}>
                    <Image
                      source={{ uri: "https://your-thumbnail-url.png" }}
                      style={styles.thumbnail}
                    />
                    <View style={styles.playButton}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                  </View>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  videoCard: {
    width: 160,
    marginHorizontal: 8,
    marginLeft: 16,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "white",
    fontSize: 14,
  },
  videoTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
