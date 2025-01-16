import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as Sentry from '@sentry/node';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: 'postmessage',
    });
  }

  async verifyAuthCode(authCode: string): Promise<any> {
    try {
      const response = await this.oauth2Client.getToken(authCode);
      return response.tokens;
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  async verifyIdToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
