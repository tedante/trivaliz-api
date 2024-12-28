import { Injectable } from '@nestjs/common';
import { dynamoDBClient } from '../dynamodb/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  async findAll(): Promise<any> {
    const params = {
      TableName: 'Users',
    };
    return await dynamoDBClient().scan(params).promise();
  }

  async create(user: any): Promise<any> {
    return await dynamoDBClient()
      .put({
        TableName: 'Users',
        Item: {
          id: uuidv4(),
          username: user.username,
          email: user.email,
          password: user.password,
        },
      })
      .promise();
  }

  async findOne(id: string): Promise<any> {
    const params = {
      TableName: 'Users',
      Key: { id },
    };
    return await dynamoDBClient().get(params).promise();
  }

  async findByUsername(username: string): Promise<any> {
    const params = {
      TableName: 'Users',
      IndexName: 'UsernameIndex',
      KeyConditionExpression: 'username',
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    return await dynamoDBClient().query(params).promise();
  }

  async update(id: string, data: any): Promise<any> {
    const params = {
      TableName: 'Users',
      Key: { id },
      UpdateExpression: 'set username = :username, email = :email',
      ExpressionAttributeValues: {
        ':username': data.username,
        ':email': data.email,
      },
      ReturnValues: 'ALL_NEW',
    };
    return await dynamoDBClient().update(params).promise();
  }

  async delete(id: string): Promise<any> {
    const params = {
      TableName: 'Users',
      Key: { id },
    };
    return await dynamoDBClient().delete(params).promise();
  }
}
