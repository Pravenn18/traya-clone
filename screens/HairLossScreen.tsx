import Header from "@/components/Header";
import { questionsData } from "@/constants/Data";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import SelectionCard from "@/components/Options";
import { answersAtom, currentQuestionIndexAtom } from "@/data/atom";
import TrayaButton from "@/components/TrayaButton";
import ProgressBar from "@/components/ProgressBar";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

const HairLossScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(
    currentQuestionIndexAtom
  );
  const [answers, setAnswers] = useAtom(answersAtom);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const currentQuestion = questionsData[currentQuestionIndex];

  const pickImage = async (useCamera: boolean) => {
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need gallery permissions to make this work!');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      // Rvact@7349
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error picking image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Error taking photo. Please try again.');
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push('/(stack)/resultScreen');
    }
  };

  const handleOptionSelect = (option: string, index: number) => {
    const currentType = currentQuestion.type || "radio";
    let newAnswers = { ...answers };

    if (!newAnswers[currentQuestion.id]) {
      newAnswers[currentQuestion.id] = { selectedOptions: [] };
    }

    if (currentType === "checkbox") {
      const currentSelections = newAnswers[currentQuestion.id].selectedOptions;
      const existingSelectionIndex = currentSelections.findIndex(
        (selection) => selection.index === index
      );

      if (existingSelectionIndex >= 0) {
        currentSelections.splice(existingSelectionIndex, 1);
      } else {
        currentSelections.push({ option, index });
      }
    } else {
      newAnswers[currentQuestion.id] = {
        selectedOptions: [{ option, index }],
      };

      if (currentQuestionIndex < questionsData.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 300);
      }
    }

    setAnswers(newAnswers);
  };

  const getDefaultSelected = () => {
    if (answers[currentQuestion.id]) {
      return answers[currentQuestion.id].selectedOptions.map(
        (selection) => selection.index
      );
    }
    return [];
  };

  const renderContinueButton = () => {
    if (currentQuestion.type === "checkbox") {
      const hasSelections =
        answers[currentQuestion.id]?.selectedOptions?.length > 0;

      return (
        <View className="flex flex-row justify-center w-full mt-4">
          <TouchableOpacity
            className={`p-4 rounded-lg w-52 ${
              hasSelections ? "bg-[#BDD752]" : "bg-gray-300"
            }`}
            disabled={!hasSelections}
            onPress={() => {
              if (currentQuestionIndex < questionsData.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              }
            }}
          >
            <Text
              className={`text-center font-medium ${
                hasSelections ? "text-black" : "text-gray-500"
              }`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderLastPage = () => {
    return (
      <View className="flex-1 px-5">
        <View className="my-6">
          <Image source={currentQuestion.titleImage} className="w-20 h-20" />
          <Text className="font-medium text-4xl mt-4 text-[#8A8B85]">
            {currentQuestion.title}
          </Text>
          <View className="bg-[#F3F3F1] w-20 h-2 mt-6" />
        </View>

        <View className="flex-1 items-center justify-center mt-4">
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="w-48 h-48 mb-8 rounded-lg"
            />
          ) : (
            <Image
              source={require("../assets/images/scalp.png")}
              className="w-48 h-48 mb-8"
            />
          )}
          <Text className="font-medium text-xl text-center mb-10">
            Upload scalp photo to help doctors diagnose and prescribe your kit
          </Text>

          <View className="w-full space-y-4 mb-8 gap-2">
            <TrayaButton
              title="Upload From Gallery"
              onPress={() => pickImage(false)}
            />
            <TrayaButton 
              title="Take Photo" 
              onPress={takePhoto}
            />
          </View>

          {selectedImage && (
            <View className="w-full mt-4">
              <TrayaButton
                title="Continue"
                onPress={handleContinue}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const determineCardType = () => {
    return currentQuestion.type || "radio";
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <ProgressBar pageId={currentQuestion.id} />
      {currentQuestion.id === 12 ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {renderLastPage()}
        </ScrollView>
      ) : (
        <ScrollView className="px-5 flex-1">
          {currentQuestion.title && (
            <View className="my-6">
              <Image
                source={currentQuestion.titleImage}
                className="w-20 h-20 left-5"
              />
              <Text className="font-medium text-4xl mt-4 text-[#8A8B85]">
                {currentQuestion.title}
              </Text>
              <View className="bg-[#F3F3F1] w-20 h-2 mt-6" />
            </View>
          )}
          <Text className="font-normal text-lg mb-6 text-[#8A8B85]">
            {currentQuestion.question}
          </Text>
          <SelectionCard
            type={determineCardType()}
            options={currentQuestion.options}
            optionsImage={currentQuestion.optionsImage}
            onSelect={handleOptionSelect}
            defaultSelected={getDefaultSelected()}
          />

          {renderContinueButton()}
          <View className="flex-row justify-center items-center my-6">
            <Text className="text-gray-500">
              Question {currentQuestionIndex + 1} of {questionsData.length}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HairLossScreen;
