import { Injectable } from '@nestjs/common';
// import { User } from './user.schema';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import * as bcrypt from 'bcryptjs';
import { dynamoDBClient } from 'src/dynamodb/dynamodb.service';

@Injectable()
export class UserService {
  async findAll() {
    return await dynamoDBClient.scan({
        TableName: 'users',
      }) 
      .promise();
  }


  // constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  // async findAll(): Promise<User[]> {
  //   return this.userModel.find().exec();
  // }

  // async create(user: User): Promise<User> {
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(user.password, salt);

  //   const createdUser = new this.userModel({
  //     ...user,
  //     password: hashedPassword,
  //   });

  //   return createdUser.save();
  // }

  // async findOneByEmail(email: string): Promise<User> {
  //   return this.userModel.findOne({ email }).exec();
  // }

  // async findOneById(id: string): Promise<User> {
  //   return await this.userModel.findById(id, {
  //     password: 0,
  //     __v: 0,
  //   }).exec();
  // }
}
