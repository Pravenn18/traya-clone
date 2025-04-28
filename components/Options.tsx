import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";

interface SelectionCardProps {
  type: "info" | "radio" | "checkbox";
  options?: string[];
  optionsImage?: (ImageSourcePropType | string)[];
  onSelect?: (option: string, index: number) => void;
  defaultSelected?: number[];
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  type = "radio",
  options = [],
  optionsImage = [],
  onSelect,
  defaultSelected = [],
}) => {
  const [selected, setSelected] = useState<number[]>(defaultSelected);

  useEffect(() => {
    setSelected(defaultSelected);
  }, [JSON.stringify(defaultSelected)]);

  const handleSelection = (index: number) => {
    let newSelected: number[];

    if (type === "radio" || type === "info") {
      newSelected = [index];
    } else if (type === "checkbox") {
      if (selected.includes(index)) {
        newSelected = selected.filter((item) => item !== index);
      } else {
        newSelected = [...selected, index];
      }
    } else {
      return;
    }

    setSelected(newSelected);
    if (onSelect && options[index]) {
      onSelect(options[index], index);
    }
  };

  const renderOptions = () => {
    return options.map((option, index) => {
      const isSelected = selected.includes(index);
      const hasImage = optionsImage[index] && optionsImage[index] !== "";

      return (
        <TouchableOpacity
          key={index}
          className={`border rounded-lg p-4 flex-row items-center mb-3 ${
            isSelected ? "border-[#BDD752] bg-[#F3F7DE]" : "border-gray-200"
          }`}
          onPress={() => handleSelection(index)}
        >
          {type === "radio" && (
            <View
              className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                isSelected ? "border-[#BDD752]" : "border-gray-300"
              }`}
            >
              {isSelected && (
                <View className="w-3 h-3 rounded-full bg-[#BDD752]"></View>
              )}
            </View>
          )}

          {type === "checkbox" && (
            <View
              className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                isSelected ? "border-[#BDD752] bg-[#BDD752]" : "border-gray-300"
              }`}
            >
              {isSelected && (
                <View className="items-center justify-center">
                  <View className="w-3 h-2 border-white border-r-2 border-b-2 -mt-0.5 rotate-45" />
                </View>
              )}
            </View>
          )}

          <View className="flex-row items-center flex-1">
            {hasImage && (
              <View className="mr-3">
                <Image
                  source={optionsImage[index] as ImageSourcePropType}
                  className="w-10 h-10 rounded"
                />
              </View>
            )}

            <Text className="text-base">{option}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return <View className="w-full my-4">{renderOptions()}</View>;
};

export default SelectionCard;
