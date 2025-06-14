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
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async followUser(@Param('id') targetUserId: string, @Request() req) {
    return this.usersService.followUser(req.user.userId, targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  async unfollowUser(@Param('id') targetUserId: string, @Request() req) {
    return this.usersService.unfollowUser(req.user.userId, targetUserId);
  }
}
