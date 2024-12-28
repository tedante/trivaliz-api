// import { Injectable } from '@nestjs/common';
// // import * as AWS from 'aws-sdk';
// // import {
// //   AuthenticationDetails,
// //   CognitoUser,
// //   CognitoUserPool,
// // } from 'amazon-cognito-identity-js';

// import { Amplify } from 'aws-amplify';
// import { signUp } from '@aws-amplify/auth';
// import * as bcrypt from 'bcryptjs';
// import { UsersService } from '../users/users.service';
// import { config } from 'dotenv';

// config();

// @Injectable()
// export class AuthService {
//   constructor(private usersService: UsersService) {
//     Amplify.configure({
//       Auth: { 
//         Cognito: {
//           userPoolId: process.env.COGNITO_USER_POOL_ID,
//           userPoolClientId: process.env.COGNITO_CLIENT_ID,
//         },
//       },
//     });
//   }

//   async register(
//     username: string,
//     email: string,
//     password: string,
//     country: string,
//   ): Promise<any> {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       console.log(signUp, ">>>>");
      
//       const signUpResult = await signUp({
//         username,
//         password,
//         options: {
//           userAttributes: {
//             email,
//             'custom:country': country,
//           },
//         },
//       });

//       await this.usersService.create({
//         username,
//         email,
//         password: hashedPassword,
//         country,
//       });

//       return signUpResult;
//     } catch (error) {
//       throw new Error(`Registration failed: ${error.message}`);
//     }
//   }

//   // async login(username: string, password: string): Promise<any> {
//   //   try {
//   //     const user = await Auth.signIn(username, password);
//   //     const session = user.getSignInUserSession();
//   //     return {
//   //       accessToken: session.getAccessToken().getJwtToken(),
//   //       idToken: session.getIdToken().getJwtToken(),
//   //       refreshToken: session.getRefreshToken().getToken(),
//   //     };
//   //   } catch (error) {
//   //     throw new Error(`Login failed: ${error.message}`);
//   //   }
//   // }

//   // async verifyToken(): Promise<any> {
//   //   try {
//   //     return await Auth.currentAuthenticatedUser();
//   //   } catch (error) {
//   //     throw new Error('Invalid token');
//   //   }
//   // }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string, country: string) {
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
}