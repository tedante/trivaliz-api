import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../dynamodb/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private dynamoDBService: DynamoDBService) {}

  async findAll(): Promise<any> {
    try {
      const params = {
        TableName: 'Users',
      };
      return await this.dynamoDBService.dynamoDB.scan(params).promise();
    } catch (error) {
      throw new Error(`Error fetching all users: ${error.message}`);
    }
  }

  async create(user: any): Promise<any> {
    try {
      return await this.dynamoDBService.dynamoDB
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
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const params = {
        TableName: 'Users',
        Key: { id },
        ProjectionExpression: 'id, username, email, picture, country, xp',
      };

      const users = await this.dynamoDBService.dynamoDB.get(params).promise();
      if (!users.Item) {
        return { message: 'User not found' };
      }

      return users.Item;
    } catch (error) {
      throw new Error(`Error fetching user with id ${id}: ${error.message}`);
    }
  }

  async findByIds(ids: string[]): Promise<any> {
    try {
      const keys = ids.map((id) => ({ id }));
      const params = {
        RequestItems: {
          Users: {
            Keys: keys,
            ProjectionExpression: 'id, username, email, picture',
          },
        },
      };
      const response = await this.dynamoDBService.dynamoDB
        .batchGet(params)
        .promise();
      return response.Responses['Users'];
    } catch (error) {
      throw new Error(`Error fetching users by ids: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
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

      return await this.dynamoDBService.dynamoDB.scan(params).promise();
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  async findByUsername(username: string): Promise<any> {
    try {
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

      return await this.dynamoDBService.dynamoDB.scan(params).promise();
    } catch (error) {
      throw new Error(`Error fetching user by username: ${error.message}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
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
      const update = await this.dynamoDBService.dynamoDB
        .update(params)
        .promise();

      return {
        id: update.Attributes.id,
        username: update.Attributes.username,
        country: update.Attributes.country,
        picture: update.Attributes.picture,
      };
    } catch (error) {
      throw new Error(`Error updating user with id ${id}: ${error.message}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const params = {
        TableName: 'Users',
        Key: { id },
      };
      return await this.dynamoDBService.dynamoDB.delete(params).promise();
    } catch (error) {
      throw new Error(`Error deleting user with id ${id}: ${error.message}`);
    }
  }
}
