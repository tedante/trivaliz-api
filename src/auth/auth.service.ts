import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { GoogleAuthService } from './google.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
    country: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const findUser = await this.usersService.findByEmail(email);

      if (findUser.Count > 0) {
        throw new UnauthorizedException('Email already exists');
      }

      const user = await this.usersService.create({
        username,
        email,
        password: hashedPassword,
        country,
      });
      return user;
    } catch (error) {
      throw new UnauthorizedException(`Registration failed: ${error.message}`);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user.Count === 0) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.Items[0].password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user.Items[0];
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      country: user.country,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        country: user.country,
      },
    };
  }

  async googleLogin(googleToken: string) {
    const payload = await this.googleAuthService.verifyIdToken(googleToken);
    let user = await this.usersService.findByEmail(payload.email);
    if (user.Count === 0) {
      await this.usersService.create({
        email: payload.email,
        username: payload.email.split('@')[0],
        password: bcrypt.hashSync(Math.random().toString(36).substring(7), 10),
        country: null,
      });

      user = await this.usersService.findByEmail(payload.email);
    }

    const userLogin = {
      id: user.Items[0].id,
      username: user.Items[0].username,
      email: user.Items[0].email,
      country: user.Items[0].country,
    };

    return userLogin;
  }
}
