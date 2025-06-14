import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    try {
      const post = await this.postsService.create(createPostDto, req.user.userId);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Post created successfully',
        data: post,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('privacy') privacy: string = 'public',
    @Request() req: any
  ) {
    try {
      const result = await this.postsService.findAll(
        parseInt(page),
        parseInt(limit),
        req.user?.userId,
        privacy
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Posts retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  async getFeed(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: any
  ) {
    try {
      const result = await this.postsService.getFeed(
        parseInt(page),
        parseInt(limit),
        req.user.userId
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Feed retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('search')
  @UseGuards(OptionalJwtAuthGuard)
  async search(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: any
  ) {
    try {
      const result = await this.postsService.search(
        query,
        parseInt(page),
        parseInt(limit),
        req.user?.userId
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Search results retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('user/:userId')
  @UseGuards(OptionalJwtAuthGuard)
  async findByAuthor(
    @Param('userId') authorId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: any
  ) {
    try {
      const result = await this.postsService.findByAuthor(
        authorId,
        parseInt(page),
        parseInt(limit),
        req.user?.userId
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'User posts retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findById(@Param('id') id: string, @Request() req: any) {
    try {
      const post = await this.postsService.findById(id, req.user?.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Post retrieved successfully',
        data: post,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any
  ) {
    try {
      const post = await this.postsService.update(id, updatePostDto, req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Post updated successfully',
        data: post,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Request() req: any) {
    try {
      await this.postsService.delete(id, req.user.userId);
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async likePost(@Param('id') id: string, @Request() req: any) {
    try {
      const result = await this.postsService.likePost(id, req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: result.liked ? 'Post liked successfully' : 'Post unliked successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/share')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async sharePost(@Param('id') id: string, @Request() req: any) {
    try {
      const result = await this.postsService.sharePost(id, req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: result.shared ? 'Post shared successfully' : 'Post unshared successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any
  ) {
    try {
      const comment = await this.postsService.addComment(id, createCommentDto, req.user.userId);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Comment added successfully',
        data: comment,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    try {
      const result = await this.postsService.getComments(
        id,
        parseInt(page),
        parseInt(limit)
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Comments retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteComment(
    @Param('id') postId: string,
    @Param('commentId') commentId: string,
    @Request() req: any
  ) {
    try {
      await this.postsService.deleteComment(postId, commentId, req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}