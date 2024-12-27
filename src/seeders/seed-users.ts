import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

config();

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
    email: 'user1@example.com',
    password: 'hashedpassword1',
    country: 'USA',
  },
  {
    id: uuidv4(),
    username: 'user2',
    email: 'user2@example.com',
    password: 'hashedpassword2',
    country: 'Canada',
  },
  // Add more sample users as needed
];

users.forEach((user) => {
  const params = {
    TableName: 'users',
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

