export type QuestionType = "info" | "radio" | "checkbox";

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  titleImage: any;
  question: string;
  options: string[];
  optionsImage?: any[];
}

export interface UserAnswer {
  questionId: number;
  selectedOptions: string[] | string;
}

export interface HairAssessmentResult {
  stage: string;
  hairLossType: string;
  hairGrowthPossibility: number;
  cause: {
    primaryCause: string;
    description: string;
  };
  contributingFactors: {
    name: string;
    description: string;
  }[];
  recommendedProducts: {
    name: string;
    description: string;
    imageUrl?: string;
  }[];
}

export type VideoItem = {
  id: string;
  title: string;
  url: string;
};

export type VideoSection = {
  title: string;
  videos: VideoItem[];
};
