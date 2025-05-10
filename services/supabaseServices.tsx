import { supabase } from "@/utils/supabase";

export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) console.error(error);
  else console.log(data);
};

export const updateHairTestResults = async (
  userId: string,
  scalpUrl: string,
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
  }>,
  suggestedProducts: Array<{
    name: string;
    description: string;
  }>
) => {
  const { data, error } = await supabase
    .from('hair-test')
    .upsert({
      user_id: userId,
      scalpurl: scalpUrl,
      diagnosis: diagnosis,
      suggested_products: suggestedProducts,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error updating hair test results:', error);
    throw error;
  }

  return data;
};
