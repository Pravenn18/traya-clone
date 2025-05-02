import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { useAtom } from "jotai";
import { formattedAnswersAtom } from "@/data/atom";
import { calculateHairAssessment } from "@/services/hairAssessmentLogic";

export default function ResultsScreen() {
  const [data] = useAtom(formattedAnswersAtom);
  const assessmentResult = calculateHairAssessment(data);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <ScrollView className="flex-1 px-5">
        <View className="my-6">
          <Text className="font-medium text-4xl mt-4 text-[#8A8B85]">
            Your Hair Assessment
          </Text>
          <View className="bg-[#F3F3F1] w-20 h-2 mt-6" />
        </View>
        <View className="bg-[#F9F9F7] p-5 rounded-lg mb-6">
          <Text className="font-medium text-lg text-[#8A8B85]">
            Hair Loss Stage
          </Text>
          <Text className="font-bold text-2xl text-[#5D5F56] mt-1">
            {assessmentResult.stage}
          </Text>

          <Text className="font-medium text-lg text-[#8A8B85] mt-4">
            Hair Loss Type
          </Text>
          <Text className="font-bold text-2xl text-[#5D5F56] mt-1">
            {assessmentResult.hairLossType}
          </Text>

          <View className="mt-6">
            <Text className="font-medium text-lg text-[#8A8B85]">
              Hair Growth Possibility
            </Text>
            <View className="mt-3 relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="absolute left-0 top-0 bottom-0 bg-[#BDD752]"
                style={{ width: `${assessmentResult.hairGrowthPossibility}%` }}
              />
            </View>
            <Text className="mt-1 font-bold text-lg text-[#5D5F56]">
              {assessmentResult.hairGrowthPossibility}%
            </Text>
          </View>
        </View>
        <View className="bg-[#F9F9F7] p-5 rounded-lg mb-6">
          <Text className="font-medium text-xl text-[#5D5F56]">
            Primary Cause
          </Text>
          <Text className="font-bold text-xl text-[#BDD752] mt-2">
            {assessmentResult.cause.primaryCause}
          </Text>
          <Text className="text-[#8A8B85] mt-2">
            {assessmentResult.cause.description}
          </Text>
        </View>

        {assessmentResult.contributingFactors.length > 0 && (
          <View className="bg-[#F9F9F7] p-5 rounded-lg mb-6">
            <Text className="font-medium text-xl text-[#5D5F56]">
              Contributing Factors
            </Text>
            {assessmentResult.contributingFactors.map((factor, index) => (
              <View key={index} className="mt-4">
                <Text className="font-bold text-lg text-[#5D5F56]">
                  {factor.name}
                </Text>
                <Text className="text-[#8A8B85] mt-1">
                  {factor.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View className="bg-[#F9F9F7] p-5 rounded-lg mb-10">
          <Text className="font-medium text-xl text-[#5D5F56]">
            Recommended Products
          </Text>
          {assessmentResult.recommendedProducts.map((product, index) => (
            <View key={index} className="mt-4 pb-4 border-b border-gray-200">
              <Text className="font-bold text-lg text-[#5D5F56]">
                {product.name}
              </Text>
              <Text className="text-[#8A8B85] mt-1">{product.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
