import {
  Controller,
  Get,
  Req,
  UseInterceptors,
  UploadedFile,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Express } from 'express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // @Post()
  // async create(@Body() user: any) {
  // return this.usersService.create(user);
  // }

  @Get('/profile')
  async findOne(@Req() request: Request) {
    const user = request.user as any;

    return this.usersService.findOne(user.id);
  }

  @Get('/')
  async findAll() {
    return this.usersService.findAll();
  }

  @Put('/')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateData: { country?: string; username?: string },
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const user = request.user as any;

    if (photo) {
      const photoUrl = await this.cloudinaryService.uploadImage(photo);
      updateData['picture'] = photoUrl;
    } else {
      updateData['picture'] = user.picture;
    }

    return this.usersService.update(user.id, updateData);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.usersService.delete(id);
  // }
}
