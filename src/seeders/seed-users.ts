import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

config();
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log(
  'AWS_DYNAMODB_ENDPOINT_URL:',
  process.env.AWS_DYNAMODB_ENDPOINT_URL,
);
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT_URL,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const users = [
  {
    id: uuidv4(),
    username: 'user1',
    email: 'user1@yopmail.com',
    password: 'hashedpassword1',
    country: 'Indonesia',
  },
  {
    id: uuidv4(),
    username: 'user2',
    email: 'user2@yopmail.com',
    password: 'hashedpassword2',
    country: 'Indonesia',
  },
  // Add more sample users as needed
];

users.forEach((user) => {
  const params = {
    TableName: 'Users',
    Item: user,
  };

  dynamoDB.put(params, (err) => {
    if (err) {
      console.error('Error seeding user:', err);
    } else {
      console.log('User seeded successfully:', user.username);
    }
  });
});
