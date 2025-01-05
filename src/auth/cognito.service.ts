import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from '@aws-sdk/client-cognito-identity';
import * as AWS from 'aws-sdk';

@Injectable()
export class CognitoService {
  private cognitoIdentity: CognitoIdentityClient;
  private cognitoIdentityServiceProvider: AWS.CognitoIdentityServiceProvider;

  constructor(private configService: ConfigService) {
    this.cognitoIdentity = new CognitoIdentityClient({
      region: this.configService.get<string>('AWS_REGION'),
    });

    this.cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider({
        region: this.configService.get<string>('AWS_REGION'),
      });
  }

  async signUp(
    username: string,
    password: string,
    email: string,
  ): Promise<AWS.CognitoIdentityServiceProvider.SignUpResponse> {
    const params: AWS.CognitoIdentityServiceProvider.SignUpRequest = {
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    return this.cognitoIdentityServiceProvider.signUp(params).promise();
  }

  async confirmSignUp(
    username: string,
    confirmationCode: string,
  ): Promise<AWS.CognitoIdentityServiceProvider.ConfirmSignUpResponse> {
    const params: AWS.CognitoIdentityServiceProvider.ConfirmSignUpRequest = {
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      Username: username,
      ConfirmationCode: confirmationCode,
    };

    return this.cognitoIdentityServiceProvider.confirmSignUp(params).promise();
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<AWS.CognitoIdentityServiceProvider.InitiateAuthResponse> {
    const params: AWS.CognitoIdentityServiceProvider.InitiateAuthRequest = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    return this.cognitoIdentityServiceProvider.initiateAuth(params).promise();
  }

  async getCredentials(idToken: string): Promise<AWS.Credentials> {
    const identityPoolId = this.configService.get<string>(
      'COGNITO_IDENTITY_POOL_ID',
    );
    const userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');

    const getIdParams = {
      IdentityPoolId: identityPoolId,
      Logins: {
        [`cognito-idp.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${userPoolId}`]:
          idToken,
      },
    };

    const { IdentityId } = await this.cognitoIdentity.send(
      new GetIdCommand(getIdParams),
    );

    const getCredentialsParams = {
      IdentityId,
      Logins: getIdParams.Logins,
    };

    const { Credentials } = await this.cognitoIdentity.send(
      new GetCredentialsForIdentityCommand(getCredentialsParams),
    );

    return new AWS.Credentials({
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretKey,
      sessionToken: Credentials.SessionToken,
    });
  }
}
