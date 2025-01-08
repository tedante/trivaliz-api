import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new OAuth2Client();
  }

  async verifyIdToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      throw new Error(`Token Invalid`);
    }
  }
}
