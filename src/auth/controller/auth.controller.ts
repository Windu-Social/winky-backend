import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<LoginResponse> {
    return await this.authService.register(body);
  }
}
