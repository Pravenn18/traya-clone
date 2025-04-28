import React from "react";
import { TouchableOpacity, Text, GestureResponderEvent } from "react-native";

type Props = {
  title: string;
  onPress: any;
};

const TrayaButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-[#B7D340] px-7 py-4 justify-center items-center rounded-2xl"
      onPress={onPress}
    >
      <Text className="text-black text-lg font-medium">{title}</Text>
    </TouchableOpacity>
  );
};

export default TrayaButton;
