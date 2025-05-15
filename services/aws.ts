import AWS from 'aws-sdk';
import Constants from 'expo-constants';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = Constants.expoConfig?.extra?.aws ?? {};

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

// TODO: Need to change this method of uploading image to s3, not secure for mobile app
export const uploadFile = async (fileUri: any): Promise<string> => {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const params = {
    Bucket: 'traya-assets',
    Key: 'image.jpg',
    Body: blob,
    ContentType: 'image/jpeg',
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};
