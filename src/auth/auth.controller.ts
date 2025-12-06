import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('verify')
  verifyUser() {
    return {
      message: 'user verified',
    };
  }

  @Post('login')
  loginUser() {
    return {
      message: 'user logged in',
    };
  }

  @Get('logout')
  logOutUser() {
    return {
      message: 'user logged out',
    };
  }
}
