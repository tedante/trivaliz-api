import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() user: any) {
    // return this.usersService.create(user);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  @Get('/')
  async findAll() {
    return this.usersService.findAll();
  }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() user: any) {
  //   return this.usersService.update(id, user);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.usersService.delete(id);
  // }
}
