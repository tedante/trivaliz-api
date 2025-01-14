import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';

@Module({
  imports: [CloudinaryModule],
  providers: [UsersService, DynamoDBService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
