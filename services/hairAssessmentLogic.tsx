import { UserAnswer } from "@/types";

// Hair assessment result types
export interface ContributingFactor {
  name: string;
  description: string;
}

export interface RecommendedProduct {
  name: string;
  description: string;
}

export interface Cause {
  primaryCause: string;
  description: string;
}

export interface HairAssessmentResult {
  stage: string;
  hairLossType: string;
  hairGrowthPossibility: number;
  cause: Cause;
  contributingFactors: ContributingFactor[];
  recommendedProducts: RecommendedProduct[];
}

export const calculateHairAssessment = (
  answers: UserAnswer[]
): HairAssessmentResult => {
  let result: HairAssessmentResult = {
    stage: "Stage-1",
    hairLossType: "General Hair Thinning",
    hairGrowthPossibility: 75,
    cause: {
      primaryCause: "Multiple Factors",
      description:
        "Your hair loss appears to be caused by a combination of factors.",
    },
    contributingFactors: [],
    recommendedProducts: [],
  };

  // Determine hair loss stage and type based on question 1
  const hairLossLocationAnswer = answers.find((a) => a.questionId === 1)
    ?.selectedOptions as string;
  if (hairLossLocationAnswer) {
    if (hairLossLocationAnswer === "Both front and top of the head") {
      result.stage = "Stage-3";
      result.hairLossType = "Advanced Male Pattern Hair Loss";
      result.hairGrowthPossibility = 65;
    } else if (hairLossLocationAnswer === "At the top of the head only") {
      result.stage = "Stage-2";
      result.hairLossType = "Male Pattern Hair Loss";
      result.hairGrowthPossibility = 80;
    } else if (hairLossLocationAnswer === "Front only") {
      result.stage = "Stage-1";
      result.hairLossType = "Early Male Pattern Hair Loss";
      result.hairGrowthPossibility = 93;
    }
  }

  // Check genetics (question 2)
  const geneticsAnswer = answers.find((a) => a.questionId === 2)
    ?.selectedOptions as string;
  if (geneticsAnswer && geneticsAnswer !== "None") {
    result.cause = {
      primaryCause: "DHT Hormones",
      description:
        "Your hair loss is primarily caused by DHT (dihydrotestosterone) sensitivity, a genetic condition where hair follicles are affected by this hormone.",
    };

    // Higher genetic factors reduce growth possibility
    if (geneticsAnswer === "Both") {
      result.hairGrowthPossibility -= 10;
    } else {
      result.hairGrowthPossibility -= 5;
    }

    result.contributingFactors.push({
      name: "Genetic Predisposition",
      description:
        "Your family history suggests a genetic predisposition to hair loss.",
    });
  }

  // Check heavy hair fall (question 3)
  const hairFallAnswer = answers.find((a) => a.questionId === 3)
    ?.selectedOptions as string[];
  if (
    hairFallAnswer &&
    hairFallAnswer.length > 0 &&
    !hairFallAnswer.includes("None")
  ) {
    result.contributingFactors.push({
      name: "Physical Stress",
      description:
        "Recent physical changes or medical treatments have contributed to your hair loss.",
    });
    result.hairGrowthPossibility += 5; // May be temporary, so better chances of recovery
  }

  // Check dandruff (question 4)
  const dandruffAnswer = answers.find((a) => a.questionId === 4)
    ?.selectedOptions as string;
  if (dandruffAnswer && dandruffAnswer !== "None") {
    result.contributingFactors.push({
      name: "Scalp Condition",
      description: "Scalp issues like dandruff are affecting your hair health.",
    });

    result.recommendedProducts.push({
      name: "Anti-Dandruff Shampoo",
      description:
        "Regular use will help control dandruff and improve scalp health.",
    });

    // Serious scalp conditions
    if (
      dandruffAnswer === "I have Psoriasis" ||
      dandruffAnswer === "I have Seborrheic Dermatitis"
    ) {
      result.hairGrowthPossibility -= 8;
      result.recommendedProducts.push({
        name: "Medicated Scalp Treatment",
        description:
          "For managing your specific scalp condition, consult a dermatologist.",
      });
    }
  }

  // Check sleep (question 5)
  const sleepAnswer = answers.find((a) => a.questionId === 5)
    ?.selectedOptions as string;
  if (sleepAnswer && sleepAnswer !== "Very peacefully for 6 to 8 hours") {
    result.contributingFactors.push({
      name: "Sleep Quality",
      description:
        "Poor sleep affects hormone balance and cell regeneration, which impacts hair health.",
    });

    result.hairGrowthPossibility -= 3;

    result.recommendedProducts.push({
      name: "Sleep Support Supplement",
      description: "Contains melatonin and herbs to improve sleep quality.",
    });
  }

  // Check energy levels (question 6)
  const energyAnswer = answers.find((a) => a.questionId === 6)
    ?.selectedOptions as string;
  if (energyAnswer && energyAnswer !== "Always high") {
    result.contributingFactors.push({
      name: "Energy Levels",
      description:
        "Low energy levels may indicate metabolic issues affecting hair growth.",
    });
  }

  // Check digestion (questions 7 & 8)
  const constipationAnswer = answers.find((a) => a.questionId === 7)
    ?.selectedOptions as string;
  const gasAnswer = answers.find((a) => a.questionId === 8)
    ?.selectedOptions as string;

  if (
    (constipationAnswer && constipationAnswer !== "No/Rarely") ||
    (gasAnswer && gasAnswer === "Yes")
  ) {
    result.contributingFactors.push({
      name: "Digestive Health",
      description:
        "Digestive issues can affect nutrient absorption needed for healthy hair.",
    });

    result.recommendedProducts.push({
      name: "Probiotic Supplement",
      description: "Helps improve gut health and nutrient absorption.",
    });
  }

  // Check stress (question 9)
  const stressAnswer = answers.find((a) => a.questionId === 9)
    ?.selectedOptions as string;
  if (
    stressAnswer &&
    (stressAnswer === "Moderate (work,family etc" ||
      stressAnswer === "High(Loss of close one,separation,home,illness)")
  ) {
    result.contributingFactors.push({
      name: "Stress Levels",
      description:
        "High stress levels can trigger hair loss by affecting hormone balance.",
    });

    if (stressAnswer === "High(Loss of close one,separation,home,illness)") {
      result.hairGrowthPossibility -= 7;
    } else {
      result.hairGrowthPossibility -= 3;
    }

    result.recommendedProducts.push({
      name: "Stress Relief Supplement",
      description: "Contains adaptogens to help your body manage stress.",
    });
  }

  // Check health issues (question 10)
  const healthAnswer = answers.find((a) => a.questionId === 10)
    ?.selectedOptions as string;
  if (healthAnswer && healthAnswer !== "None") {
    result.contributingFactors.push({
      name: "Cardiovascular Health",
      description:
        "Blood pressure and cholesterol issues can affect blood flow to hair follicles.",
    });

    result.hairGrowthPossibility -= 5;
  }

  // Final product recommendations based on overall assessment
  if (result.stage === "Stage-2" || result.stage === "Stage-3") {
    result.recommendedProducts.push({
      name: "DHT Blocker",
      description: "Helps reduce DHT production to slow down hair loss.",
    });
  }

  result.recommendedProducts.push({
    name: "Hair Growth Serum",
    description:
      "Contains minoxidil to stimulate hair follicles and promote growth.",
  });

  result.recommendedProducts.push({
    name: "Biotin & Collagen Supplement",
    description: "Provides essential nutrients for hair strength and growth.",
  });

  // Ensure hair growth possibility stays within reasonable bounds
  result.hairGrowthPossibility = Math.max(
    30,
    Math.min(95, result.hairGrowthPossibility)
  );

  return result;
};
