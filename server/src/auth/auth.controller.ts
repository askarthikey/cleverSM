import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      // Validate that either email or phone is provided
      if (!registerDto.email && !registerDto.phone) {
        throw new BadRequestException('Either email or phone number is required');
      }

      const result = await this.authService.register(registerDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Registration successful',
        data: result,
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Login failed');
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      if (!body.refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      const result = await this.authService.refreshAccessToken(body.refreshToken);
      return {
        statusCode: HttpStatus.OK,
        message: 'Token refreshed successfully',
        data: result,
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Token refresh failed');
    }
  }

  @Get('check-username/:username')
  async checkUsername(@Param('username') username: string) {
    try {
      const result = await this.authService.checkUsernameAvailability(username);
      return {
        statusCode: HttpStatus.OK,
        message: result.available ? 'Username is available' : 'Username is taken',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Username check failed');
    }
  }
}