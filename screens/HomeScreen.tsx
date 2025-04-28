import TrayaButton from "@/components/TrayaButton";
import { useRouter } from "expo-router";
import { StyleSheet, Text, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.titleContainer}>
      <Image
        source={require("../assets/images/traya-home.png")}
        className="w-full h-96 bg-[#4FAA7F]"
      />
      <View className="px-5">
        <Text className="text-4xl font-semibold pt-10">
          Know The Root Cause Of Your Hair Loss
        </Text>
        <Text className="text-lg font-normal pt-6 pb-7">
          93% saw results* in 5 months
        </Text>
        <TrayaButton
          title={"Complete The Hair Test"}
          onPress={() => router.push("/(stack)/hair-loss")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
