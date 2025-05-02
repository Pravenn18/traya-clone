import { calculateHairAssessment } from "@/services/hairAssessmentLogic";
import { VideoSection } from "@/types";
import { atom } from "jotai";

export const answersAtom = atom<{
  [key: number]: {
    selectedOptions: { option: string; index: number }[];
  };
}>({});
export const currentQuestionIndexAtom = atom<number>(0);
export const setReelPlay = atom<boolean>(false);

export const videoSectionsAtom = atom<VideoSection[]>([]);
export interface UserAnswer {
  questionId: number;
  selectedOptions: string[] | string;
}
export const formattedAnswersAtom = atom((get) => {
  const answers = get(answersAtom);
  const formattedAnswers: UserAnswer[] = [];

  Object.entries(answers).forEach(([questionId, data]) => {
    if (data.selectedOptions.length === 0) return;

    const questionIdNumber = parseInt(questionId, 10);

    if (data.selectedOptions.length > 1) {
      formattedAnswers.push({
        questionId: questionIdNumber,
        selectedOptions: data.selectedOptions.map(
          (selection) => selection.option
        ),
      });
    } else if (data.selectedOptions.length === 1) {
      formattedAnswers.push({
        questionId: questionIdNumber,
        selectedOptions: data.selectedOptions[0].option,
      });
    }
  });

  return formattedAnswers;
});

// TODO: remove this logic from here
export const hairAssessmentResultAtom = atom((get) => {
  const formattedAnswers = get(formattedAnswersAtom);

  return calculateHairAssessment(formattedAnswers);
});
