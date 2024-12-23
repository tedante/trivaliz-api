import * as dotenv from "dotenv";
dotenv.config();

export const PORT = parseInt(process.env.PORT, 10) || 3000;

export const DATABASE = {
  URI: process.env.MONGO_URI,
  DB_NAME: process.env.MONGO_DB_NAME,
};

export const aws = {
  region: process.env.AWS_REGION,
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
}

export const CLIENT_URL = process.env.CLIENT_URL ? process.env.CLIENT_URL : '*';
