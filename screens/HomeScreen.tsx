import TrayaButton from "@/components/TrayaButton";
import { answersAtom, currentQuestionIndexAtom } from "@/data/atom";
import { answersService } from "@/services/answersService";
import { hairTestService } from "@/services/hairTestService";
import { fetchUsers } from "@/services/supabaseServices";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [, setAnswers] = useAtom(answersAtom);
  const [, setCurrentQuestionIndex] = useAtom(currentQuestionIndexAtom);
  const router = useRouter();
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleContinue = async () => {
    try {
      const savedData = await answersService.getFromLocalStorage("1");
      const savedHairTest = await hairTestService.getFromLocalStorage();
      if(savedHairTest) {
        setAnswers(savedData?.answers ?? {});
        router.push("/(stack)/resultScreen");
      } else if (savedData) {
        setAnswers(savedData.answers);
        setCurrentQuestionIndex(savedData.currentQuestionIndex);
        router.push("/(tabs)/hair");
      } else {
        setAnswers({});
        setCurrentQuestionIndex(0);
        router.push("/(tabs)/hair");
      }
      
    } catch (error) {
      console.error("Error loading answers:", error);
    }
  }
  
  return (
    <SafeAreaView style={styles.titleContainer}>
      <Image
        source={require("../assets/images/traya-home.png")}
        className="w-full h-96 bg-[#4FAA7F]"
      />
      <View className="px-5 w-full">
        <Text className="text-4xl font-semibold pt-10">
          Know The Root Cause Of Your Hair Loss
        </Text>
        <Text className="text-lg font-normal pt-6 pb-7">
          93% saw results* in 5 months
        </Text>
        <TrayaButton
          title={"Complete The Hair Test"}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
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
