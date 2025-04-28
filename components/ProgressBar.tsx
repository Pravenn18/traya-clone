import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const TOTAL_PAGES = 13;

interface ProgressBarProps {
  pageId: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ pageId }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(pageId / TOTAL_PAGES, { duration: 500 });
  }, [pageId]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View className="h-1 w-full bg-gray-300 overflow-hidden">
      <Animated.View className="h-full bg-[#B9D53F]" style={animatedStyle} />
    </View>
  );
};

export default ProgressBar;
