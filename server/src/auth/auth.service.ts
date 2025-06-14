import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, JwtPayload } from './interfaces/auth.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

  constructor(private usersService: UsersService) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      // Create user
      const user = await this.usersService.create(registerDto);

      // Fix: Check if _id exists and provide fallback
      if (!user._id) {
        throw new Error('User creation failed - no ID generated');
      }

      // Generate JWT tokens
      const payload: JwtPayload = {
        userId: user._id.toString(),
        username: user.username,
      };

      const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });

      return {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          profilePicture: user.profilePicture,
          bio: user.bio,
          isVerified: user.isVerified,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Find user by identifier (username, email, or phone)
    const user = await this.usersService.findByIdentifier(loginDto.identifier);

    if (!user || !user._id) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT tokens
    const payload: JwtPayload = {
      userId: user._id.toString(),
      username: user.username,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        bio: user.bio,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      return jwt.verify(refreshToken, this.refreshSecret) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const payload = await this.verifyRefreshToken(refreshToken);
      
      // Verify user still exists
      const user = await this.validateUserById(payload.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const newPayload: JwtPayload = {
        userId: payload.userId,
        username: payload.username,
      };

      const accessToken = jwt.sign(newPayload, this.jwtSecret, { expiresIn: '15m' });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    const isAvailable = await this.usersService.checkUsernameAvailability(username);
    return { available: isAvailable };
  }

  // Add this method to your existing AuthService
  async validateUserById(userId: string): Promise<any> {
    try {
      return await this.usersService.findById(userId);
    } catch (error) {
      return null;
    }
  }
}