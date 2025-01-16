import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import type { TokenPayload } from 'google-auth-library';
import * as Sentry from '@sentry/node';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
    country: string,
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const findUser = await this.usersService.findByEmail(email);

      if (findUser.Count > 0) {
        throw new UnauthorizedException('Email already exists');
      }

      const user = await this.usersService.create({
        username,
        email,
        password: hashedPassword,
        country,
        picture:
          'https://ui-avatars.com/api/?name=' + username + '&background=random',
      });
      return user;
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user.Count === 0) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(
        pass,
        user.Items[0].password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return user.Items[0];
    } catch (error) {
      throw new UnauthorizedException(`Validation failed: ${error.message}`);
    }
  }

  async login(user: any) {
    try {
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        country: user.country,
        xp: user.xp,
        picture: user.picture,
      };

      const token = this.jwtService.sign(payload);

      return {
        token,
        user: payload,
      };
    } catch (error) {
      throw new UnauthorizedException(`Login failed: ${error.message}`);
    }
  }

  async googleLogin(payload: TokenPayload) {
    try {
      let user = await this.usersService.findByEmail(payload.email);
      if (user.Count === 0) {
        await this.usersService.create({
          email: payload.email,
          username: payload.email.split('@')[0],
          password: bcrypt.hashSync(
            Math.random().toString(36).substring(7),
            10,
          ),
          country: null,
          picture: payload.picture,
        });

        user = await this.usersService.findByEmail(payload.email);
      }

      const userLogin = {
        id: user.Items[0].id,
        username: user.Items[0].username,
        email: user.Items[0].email,
        country: user.Items[0].country,
        xp: user.Items[0].xp,
        picture: user.Items[0].picture,
      };

      return userLogin;
    } catch (error) {
      throw new UnauthorizedException(`Google login failed: ${error.message}`);
    }
  }
}
