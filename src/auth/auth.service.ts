import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { config } from 'dotenv';

config();

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(private usersService: UsersService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
    });
  }

  async register(
    username: string,
    email: string,
    password: string,
    country: string,
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        // username,
        email,
        password,
        [
          // { Name: 'email', Value: email },
          // { Name: 'custom:username', Value: username },
          // { Name: 'custom:country', Value: country },
        ],
        null,
        async (err, result) => {
          if (err) {
            reject(err);
          } else {
            try {
              await this.usersService.create({
                username,
                email,
                password: hashedPassword,
                country,
              });
              resolve(result.user);
            } catch (error) {
              reject(error);
            }
          }
        },
      );
    });
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
