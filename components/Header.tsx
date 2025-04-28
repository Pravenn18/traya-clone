// Header.tsx
import { router } from "expo-router";
import { View, Image, TouchableOpacity } from "react-native";
import { useAtom } from "jotai";
import { currentQuestionIndexAtom } from "@/data/atom";

const Header = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(
    currentQuestionIndexAtom
  );

  const handleBackPress = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.back();
    }
  };

  return (
    <View className="bg-[#299460] w-full h-40 flex-row items-end justify-between px-5">
      <TouchableOpacity onPress={handleBackPress}>
        <Image
          source={require("../assets/images/back.png")}
          className="w-7 h-7 mb-4"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={require("../assets/images/close.png")}
          className="w-7 h-7 mb-4"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
