import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';
import { calculateHairAssessment } from './hairAssessmentLogic';
import { answersService } from './answersService';

const HAIR_TEST_STORAGE_KEY = 'hair_test_results';

export interface HairTestResult {
  userId: string;
  scalpUrl: string;
  diagnosis: Array<{
    stage: string;
    hairLossType: string;
    hairGrowthPossibility: number;
    cause: {
      primaryCause: string;
      description: string;
    };
    contributingFactors: Array<{
      name: string;
      description: string;
    }>;
  }>;
  suggestedProducts: Array<{
    name: string;
    description: string;
  }>;
  createdAt: string;
}

class HairTestService {
  private static instance: HairTestService;
  private storageKey: string;

  private constructor() {
    this.storageKey = HAIR_TEST_STORAGE_KEY;
  }

  public static getInstance(): HairTestService {
    if (!HairTestService.instance) {
      HairTestService.instance = new HairTestService();
    }
    return HairTestService.instance;
  }

  private formatResults(userId: string, scalpUrl: string, assessmentResult: any): HairTestResult {
    return {
      userId,
      scalpUrl,
      diagnosis: [{
        stage: assessmentResult.stage,
        hairLossType: assessmentResult.hairLossType,
        hairGrowthPossibility: assessmentResult.hairGrowthPossibility,
        cause: assessmentResult.cause,
        contributingFactors: assessmentResult.contributingFactors
      }],
      suggestedProducts: assessmentResult.recommendedProducts,
      createdAt: new Date().toISOString()
    };
  }

  public async saveToLocalStorage(result: HairTestResult): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(result));
    } catch (error) {
      console.error('Error saving hair test results to local storage:', error);
      throw error;
    }
  }

  public async getFromLocalStorage(): Promise<{ result: HairTestResult } | null> {
    try {
      const storedData = await AsyncStorage.getItem(this.storageKey);
      if (!storedData) return null;
      
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error getting hair test results from local storage:', error);
      return null;
    }
  }

  public async saveToDatabase(userId: string, scalpUrl: any, answers: any): Promise<boolean> {
    try {
      const formattedAnswers = answersService.convertToArrayFormat(answers);//this.convertToUserAnswers(answers);
      
      if (!formattedAnswers || formattedAnswers.length === 0) {
        throw new Error('No answers found to calculate assessment');
      }

      const assessmentResult = calculateHairAssessment(formattedAnswers);
      const result = this.formatResults(userId, scalpUrl, assessmentResult);
      await this.saveToLocalStorage(result);
      
      const diagnosisArray = Array.isArray(result.diagnosis) ? result.diagnosis : [result.diagnosis];
      const suggestedProductsArray = Array.isArray(result.suggestedProducts) ? result.suggestedProducts : [result.suggestedProducts];

      const { error } = await supabase
        .from('hair-test')
        .upsert({
          user_id: userId,
          scalp_url: scalpUrl,
          diagnosis: diagnosisArray,
          suggested_products: suggestedProductsArray
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
      }

      // await AsyncStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error saving hair test results to database:', error);
      throw error;
    }
  }
}

export const hairTestService = HairTestService.getInstance(); 