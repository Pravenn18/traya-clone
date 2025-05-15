import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';
import { AnswersObject, UserAnswer } from '@/types';

const ANSWERS_STORAGE_KEY = 'answers';


type StoredAnswers = {
  answers: UserAnswer[];
  currentQuestionIndex: number;
};

class AnswersService {
  private static instance: AnswersService;
  private storageKey: string;

  private constructor() {
    this.storageKey = ANSWERS_STORAGE_KEY;
  }

  public static getInstance(): AnswersService {
    if (!AnswersService.instance) {
      AnswersService.instance = new AnswersService();
    }
    return AnswersService.instance;
  }

  public convertToArrayFormat(answers: AnswersObject): UserAnswer[] {
    return Object.entries(answers).map(([questionId, data]: [string, any]) => {
      const questionIdNumber = parseInt(questionId);
      const selectedOptions = data?.selectedOptions || [];
      
      if (selectedOptions.length > 1) {
        return {
          questionId: questionIdNumber,
          selectedOptions: selectedOptions.map((selection: any) => selection.option)
        };
      } else if (selectedOptions.length === 1) {
        return {
          questionId: questionIdNumber,
          selectedOptions: selectedOptions[0].option
        };
      }
      return {
        questionId: questionIdNumber,
        selectedOptions: []
      };
    });
  }

  private convertToObjectFormat(answers: UserAnswer[]): AnswersObject {
    const answersObject: AnswersObject = {};
    
    answers.forEach((answer: UserAnswer) => {
      const options = Array.isArray(answer.selectedOptions)
        ? answer.selectedOptions.map(option => ({ option, index: 0 }))
        : [{ option: answer.selectedOptions as string, index: 0 }];
      
      answersObject[answer.questionId] = { selectedOptions: options };
    });

    return answersObject;
  }

  public async saveToLocalStorage(answers: AnswersObject, currentQuestionIndex: number): Promise<void> {
    try {
      const formattedAnswers: StoredAnswers = {
        answers: this.convertToArrayFormat(answers),
        currentQuestionIndex
      };
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(formattedAnswers));
    } catch (error) {
      console.error('Error saving to local storage:', error);
      throw error;
    }
  }

  public async getFromLocalStorage(userId: string): Promise<{ answers: AnswersObject; currentQuestionIndex: number } | null> {
    try {
      // First try to get from database
      const { data: dbData, error } = await supabase
        .from('hair-test')
        .select('answers')
        .eq('user_id', userId)
        .single();

      if (dbData && !error) {
        // If found in database, save to local storage and return
        const formattedAnswers = this.convertToObjectFormat(dbData.answers);
        await this.saveToLocalStorage(formattedAnswers, 0); // Reset to first question
        return {
          answers: formattedAnswers,
          currentQuestionIndex: 0
        };
      }
      // If not in database, try local storage
      const storedData = await AsyncStorage.getItem(this.storageKey);
      if (!storedData) return null;
      
      const parsedData = JSON.parse(storedData) as StoredAnswers;
      return {
        answers: this.convertToObjectFormat(parsedData.answers),
        currentQuestionIndex: parsedData.currentQuestionIndex
      };
    } catch (error) {
      console.error('Error getting answers:', error);
      return null;
    }
  }

  public async saveToDatabase(userId: string, answers: AnswersObject): Promise<boolean> {
    try {
      const formattedAnswers = this.convertToArrayFormat(answers);
      
      const { error } = await supabase
        .from('hair-test')
        .upsert({
          user_id: userId,
          answers: formattedAnswers,
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
      }
      await AsyncStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  }
}

export const answersService = AnswersService.getInstance();