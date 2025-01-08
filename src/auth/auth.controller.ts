import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google.service';
import { GoogleLoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private googleAuthService: GoogleAuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      username: string;
      email: string;
      password: string;
      country: string;
    },
  ) {
    await this.authService.register(
      body.username,
      body.email,
      body.password,
      body.country,
    );

    return {
      message: 'Registration successful',
      data: {
        // username: username,
        // email: email,
        // country: country,
      },
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    const result = this.authService.login(user);

    return result;
  }

  @Post('login/google')
  async googleLogin(@Body() body: GoogleLoginDto) {
    const { type, value } = body

    let idToken = ''
    if (type === 'credential') {
      idToken = value
    } else {
      const tokens = await this.googleAuthService.verifyAuthCode(value)
      idToken = tokens.id_token
    }

    const payload = await this.googleAuthService.verifyIdToken(idToken);
    const user = await this.authService.googleLogin(payload);
    return this.authService.login(user);
  }
}
