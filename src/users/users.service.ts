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
          country: user.country,
          picture: user.picture,
          xp: 0,
        },
      })
      .promise();
  }

  async findOne(id: string): Promise<any> {
    const params = {
      TableName: 'Users',
      Key: { id },
      ProjectionExpression: 'id, username, email, picture, country, xp',
    };

    const users = await dynamoDBClient().get(params).promise();
    if (!users.Item) {
      return { message: 'User not found' };
    }

    return users.Item;
  }

  async findByIds(ids: string[]): Promise<any> {
    const keys = ids.map((id) => ({ id }));
    const params = {
      RequestItems: {
        Users: {
          Keys: keys,
          ProjectionExpression: 'id, username, email',
        },
      },
    };
    const response = await dynamoDBClient().batchGet(params).promise();
    return response.Responses['Users'];
  }

  async findByEmail(email: string): Promise<any> {
    const params = {
      TableName: 'Users',
      FilterExpression: '#email = :email',
      ExpressionAttributeNames: {
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    return await dynamoDBClient().scan(params).promise();
  }

  async findByUsername(username: string): Promise<any> {
    const params = {
      TableName: 'Users',
      FilterExpression: '#username = :username',
      ExpressionAttributeNames: {
        '#username': 'username',
      },
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    return await dynamoDBClient().scan(params).promise();
  }

  async update(id: string, data: any): Promise<any> {
    const params = {
      TableName: 'Users',
      Key: { id },
      UpdateExpression:
        'set username = :username, country = :country, picture = :picture',
      ExpressionAttributeValues: {
        ':username': data.username,
        ':country': data.country,
        ':picture': data.picture,
      },
      ReturnValues: 'ALL_NEW',
    };
    const update = await dynamoDBClient().update(params).promise();

    return {
      id: update.Attributes.id,
      username: update.Attributes.username,
      country: update.Attributes.country,
      picture: update.Attributes.picture
    };
  }

  async delete(id: string): Promise<any> {
    const params = {
      TableName: 'Users',
      Key: { id },
    };
    return await dynamoDBClient().delete(params).promise();
  }
}
