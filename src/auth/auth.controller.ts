import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('register')
  // async register(
  //   @Body()
  //   body: {
  //     username: string;
  //     email: string;
  //     password: string;
  //     country: string;
  //   },
  // ) {
  //   const register = await this.authService.register(
  //     body.username,
  //     body.email,
  //     body.password,
  //     body.country,
  //   );

  //   return {
  //     message: 'Registration successful',
  //     data: {
  //       // username: username,
  //       // email: email,
  //       // country: country,
  //     },
  //   };
  // }

  // @Post('login')
  // async login(@Body() body: { email: string; password: string }) {
  //   const user = await this.authService.validateUser(body.email, body.password);
  //   return this.authService.login(user);
  // }

  @Post('signup')
  async signUp(
    @Body() body: { username: string; password: string; email: string },
  ) {
    return this.authService.signUp(body.username, body.password, body.email);
  }

  @Post('confirm')
  async confirmSignUp(
    @Body() body: { username: string; confirmationCode: string },
  ) {
    return this.authService.confirmSignUp(body.username, body.confirmationCode);
  }

  @Post('signin')
  async signIn(@Body() body: { username: string; password: string }) {
    return this.authService.signIn(body.username, body.password);
  }
}
