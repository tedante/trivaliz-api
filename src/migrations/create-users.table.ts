import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { dynamoDBClient } from 'src/dynamodb/dynamodb.service';

config();

const { AWS_DYNAMODB_ENDPOINT_URL, AWS_REGION } = process.env;

const dynamoDB = new AWS.DynamoDB({
  region: AWS_REGION,
  endpoint: AWS_DYNAMODB_ENDPOINT_URL,
  accessKeyId: 'fakeMyKeyId', // Dummy values for local DynamoDB
  secretAccessKey: 'fakeSecretAccessKey', // Dummy values for local DynamoDB
});


const params = {
  TableName: 'Users4',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'username', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: 'UsernameIndex',
      KeySchema: [
        { AttributeName: 'username', KeyType: 'HASH' },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ],
};

dynamoDB.createTable(params, (err, data) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully:', data);
  }
});

