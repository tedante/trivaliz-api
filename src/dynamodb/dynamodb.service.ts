import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DYNAMODB } from '../common/config';

// @Injectable()
// export class DynamoDBService {
//   private readonly dynamoDB: AWS.DynamoDB.DocumentClient;

//   constructor() {
//     this.dynamoDB = new AWS.DynamoDB.DocumentClient({
//       endpoint: DYNAMODB.ENDPOINT,
//       region: DYNAMODB.REGION,
//     });
//   }

  // Add methods to interact with DynamoDB
// }
export const dynamoDBClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient({
    endpoint: DYNAMODB.ENDPOINT,
    region: DYNAMODB.REGION,
  });
};