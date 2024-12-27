import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
imprt { DocumentClient } from 'aws-sdk/clients/dynamodb';

// @Injectable()
// export class DynamoDBService {
//   private dynamoDB: AWS.DynamoDB.DocumentClient;

//   constructor(private configService: ConfigService) {
//     AWS.config.update({
//       region: this.configService.get<string>('AWS_REGION'),
//       accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
//       secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
//     });

//     this.dynamoDB = new AWS.DynamoDB.DocumentClient();
//   }

//   async create(params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
//     return this.dynamoDB.put(params).promise();
//   }

//   async findOne(params: AWS.DynamoDB.DocumentClient.GetItemInput): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> {
//     return this.dynamoDB.get(params).promise();
//   }

//   async findAll(params: AWS.DynamoDB.DocumentClient.ScanInput): Promise<AWS.DynamoDB.DocumentClient.ScanOutput> {
//     return this.dynamoDB.scan(params).promise();
//   }

//   async update(params: AWS.DynamoDB.DocumentClient.UpdateItemInput): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
//     return this.dynamoDB.update(params).promise();
//   }

//   async delete(params: AWS.DynamoDB.DocumentClient.DeleteItemInput): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
//     return this.dynamoDB.delete(params).promise();
//   }

//   async query(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
//     return this.dynamoDB.query(params).promise();
//   }
// }

const { AWS_DYNAMODB_ENDPOINT_URL, AWS_REGION } = process.env;

export const dynamoDBClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient({
    region: AWS_REGION,
    endpoint: AWS_DYNAMODB_ENDPOINT_URL,
  });
};