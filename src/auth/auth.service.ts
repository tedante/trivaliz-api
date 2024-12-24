import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      country: user.country,
    };
    
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        country: user.country,
      },
    };
  }
}
