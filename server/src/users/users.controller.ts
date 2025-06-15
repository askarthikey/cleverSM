import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponse } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserResponse> {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUsers(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Request() req
  ) {
    return this.usersService.searchUsers(query, page, limit, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('suggestions')
  async getUserSuggestions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Request() req
  ) {
    return this.usersService.getUserSuggestions(page, limit, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('following')
  async getFollowing(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Request() req
  ) {
    return this.usersService.getFollowing(req.user.userId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('followers')
  async getFollowers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Request() req
  ) {
    return this.usersService.getFollowers(req.user.userId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string, @Request() req): Promise<UserResponse> {
    try {
      const user = await this.usersService.findByIdWithFollowStatus(id, req.user.userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  @HttpCode(HttpStatus.OK)
  async followUser(@Param('id') targetUserId: string, @Request() req) {
    try {
      const result = await this.usersService.followUser(req.user.userId, targetUserId);
      return {
        statusCode: HttpStatus.OK,
        message: result.message,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  @HttpCode(HttpStatus.OK)
  async unfollowUser(@Param('id') targetUserId: string, @Request() req) {
    try {
      const result = await this.usersService.unfollowUser(req.user.userId, targetUserId);
      return {
        statusCode: HttpStatus.OK,
        message: result.message,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/follow-status')
  async getFollowStatus(@Param('id') targetUserId: string, @Request() req): Promise<any> {
    try {
      const status = await this.usersService.getFollowStatus(req.user.userId, targetUserId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Follow status retrieved successfully',
        data: status,
      };
    } catch (error) {
      throw error;
    }
  }
}
