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

  async create() {
    return await dynamoDBClient()
      .put({
        TableName: 'Users',
        Item: {
          id: uuidv4(),
          username: 'user1',
          email: 'user1@yopmail.com',
          password: 'password1',
        },
      })
      .promise();
  }

  // async findOne(id: string): Promise<any> {
  //   const params = {
  //     TableName: 'Users',
  //     Key: { id },
  //   };
  //   const result = await this.dynamoDBService.findOne(params);
  //   return result.Item;
  // }

  // async findByUsername(username: string): Promise<any> {
  //   const params = {
  //     TableName: 'Users',
  //     IndexName: 'UsernameIndex',
  //     KeyConditionExpression: 'username = :username',
  //     ExpressionAttributeValues: {
  //       ':username': username,
  //     },
  //   };
  //   const result = await this.dynamoDBService.query(params);
  //   return result.Items[0];
  // }

  // async findAll(): Promise<any[]> {
  //   const params = {
  //     TableName: 'Users',
  //   };
  //   const result = await this.dynamoDBService.findAll(params);
  //   return result.Items;
  // }

  // async update(id: string, user: any): Promise<any> {
  //   const params = {
  //     TableName: 'Users',
  //     Key: { id },
  //     UpdateExpression: 'set #username = :username, #email = :email, #country = :country',
  //     ExpressionAttributeNames: {
  //       '#username': 'username',
  //       '#email': 'email',
  //       '#country': 'country',
  //     },
  //     ExpressionAttributeValues: {
  //       ':username': user.username,
  //       ':email': user.email,
  //       ':country': user.country,
  //     },
  //     ReturnValues: 'ALL_NEW',
  //   };
  //   const result = await this.dynamoDBService.update(params);
  //   return result.Attributes;
  // }

  // async delete(id: string): Promise<void> {
  //   const params = {
  //     TableName: 'Users',
  //     Key: { id },
  //   };
  //   await this.dynamoDBService.delete(params);
  // }
}
