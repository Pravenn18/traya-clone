// Define Jotai atoms for global state
// Updated answer structure to handle multiple selections

import { atom } from "jotai";

export const answersAtom = atom<{
  [key: number]: {
    selectedOptions: { option: string; index: number }[];
  };
}>({});
export const currentQuestionIndexAtom = atom<number>(0);
export const setReelPlay = atom<boolean>(false);
