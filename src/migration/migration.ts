/**
 * create table users
 */
import * as AWS from 'aws-sdk';
import { DYNAMODB } from '../common/config';

const dynamoDB = new AWS.DynamoDB({
  endpoint: DYNAMODB.ENDPOINT,
  region: DYNAMODB.region,
});

const params = {
  TableName: 'users',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

dynamoDB.createTable(params, (err, data) => {
  if (err) {
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
  }
});