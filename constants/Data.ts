import { Question } from "@/types";

export const questionsData: Question[] = [
  {
    id: 1,
    type: "info",
    title: "HAIR LOSS",
    titleImage: require("../assets/images/repair.png"),
    question: "Where are you noticing hair loss?",
    options: [
      "Both front and top of the head",
      "At the top of the head only",
      "Front only",
    ],
    optionsImage: [
      require("../assets/images/scalpe1.png"),
      require("../assets/images/scalpe2.png"),
      require("../assets/images/scalpe3.png"),
    ],
  },
  {
    id: 2,
    type: "radio",
    title: "GENETICS",
    titleImage: require("../assets/images/genetics.png"),
    question: "Do you have a family history of hair loss?",
    options: [
      "None",
      "Mother or anyone from mother's side of the family",
      "Father or anyone from mother's side of the family",
      "Both",
    ],
    optionsImage: ["", "", "", ""],
  },
  {
    id: 3,
    type: "checkbox",
    title: "HEAVY HAIR FALL",
    titleImage: require("../assets/images/hair-image.png"),
    question: "Have you experienced any of the below in the 1 year?",
    options: [
      "None",
      "Heavy weight loss/heavy weight gain",
      "GrHeavy weight loss/heavy weight gaineen",
      "Surgery/heavy medication",
    ],
  },
  {
    id: 4,
    type: "radio",
    title: "DANDRUFF",
    titleImage: require("../assets/images/hair-wash.png"),
    question: "Do you have dandruff?",
    options: [
      "None",
      "Yes, mild that comes and goes",
      "Yes, i heavy dandruff that sticks to the scalp",
      "I have Psoriasis",
      "I have Seborrheic Dermatitis",
    ],
  },
  {
    id: 5,
    type: "radio",
    title: "SLEEP",
    titleImage: require("../assets/images/eye.png"),
    question: "How well do you sleep?",
    options: [
      "Very peacefully for 6 to 8 hours",
      "Disturbed sleep,i wake up at lest one time during the night",
      "Have difficulty falling asleep",
    ],
  },
  {
    id: 6,
    type: "radio",
    title: "ENERGY",
    titleImage: require("../assets/images/energy.png"),
    question: "How are your energy levels?",
    options: [
      "Always high",
      "Low when i wake up, but gradually increases",
      "very low in afternoon",
      "Low by evening/night",
    ],
  },
  {
    id: 7,
    type: "radio",
    title: "DIGESTION",
    titleImage: require("../assets/images/intestine.png"),
    question: "Do you feel constipated?",
    options: [
      "No/Rarely",
      "Yes",
      "Unsatisfactory bowel movements",
      "Suffering from IBS (irritable bowel syndrome)/dysentery",
    ],
  },
  {
    id: 8,
    type: "radio",
    title: "DIGESTION",
    titleImage: require("../assets/images/intestine.png"),
    question: "Do you have Gas, Acidity or Bloating",
    options: ["Yes", "No"],
  },
  {
    id: 9,
    type: "radio",
    title: "STRESS",
    titleImage: require("../assets/images/signal.png"),
    question: "How stressed are you?",
    options: [
      "Yes",
      "Low",
      "Moderate (work,family etc",
      "High(Loss of close one,separation,home,illness)",
    ],
  },
  {
    id: 10,
    type: "radio",
    title: "HEALTH ISSUES",
    titleImage: require("../assets/images/heart-pulse.png"),
    question: "Do you face any of these health issues?",
    options: [
      "None",
      "Low blood pressure",
      "High blood pressure",
      "Cholesterol",
    ],
  },
  {
    id: 11,
    type: "radio",
    title: "DEFICIENCY",
    titleImage: require("../assets/images/medicines.png"),
    question: "Are you curently taking any supplements or vitamins for hair?",
    options: ["No", "Yes", "Not Sure"],
  },
  {
    id: 12,
    type: "info",
    title: "SCALP",
    titleImage: require("../assets/images/mobile.png"),
    question: "Take a photo of your scalp",
    options: ["Take Photo"],
  },
];

export const videoSections = [
  {
    title: "Section 1",
    videos: [
      {
        id: "1",
        title: "Video 1",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      },
      {
        id: "2",
        title: "Video 2",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: "3",
        title: "Video 3",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "4",
        title: "Video 4",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
      {
        id: "5",
        title: "Video 5",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      },
    ],
  },
  {
    title: "Section 2",
    videos: [
      {
        id: "1",
        title: "Video 1",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      },
      {
        id: "2",
        title: "Video 2",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: "3",
        title: "Video 3",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "4",
        title: "Video 4",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
      {
        id: "5",
        title: "Video 5",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      },
    ],
  },
  // ... up to Section 5
];
