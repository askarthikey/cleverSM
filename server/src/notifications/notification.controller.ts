import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Request() req: any
  ) {
    try {
      const result = await this.notificationService.getNotifications(
        req.user.userId,
        parseInt(page),
        parseInt(limit)
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Notifications retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id') notificationId: string, @Request() req: any) {
    try {
      await this.notificationService.markAsRead(notificationId, req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification marked as read',
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Request() req: any) {
    try {
      await this.notificationService.markAllAsRead(req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'All notifications marked as read',
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteNotification(@Param('id') notificationId: string, @Request() req: any) {
    try {
      await this.notificationService.deleteNotification(notificationId, req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow-request')
  @HttpCode(HttpStatus.CREATED)
  async sendFollowRequest(
    @Body() body: { recipientId: string; recipientUsername: string; message?: string },
    @Request() req: any
  ) {
    try {
      const result = await this.notificationService.sendFollowRequest(
        req.user.userId,
        req.user.username,
        body.recipientId,
        body.recipientUsername,
        body.message
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Follow request sent successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('follow-requests')
  async getFollowRequests(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Request() req: any
  ) {
    try {
      const result = await this.notificationService.getFollowRequests(
        req.user.userId,
        parseInt(page),
        parseInt(limit)
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Follow requests retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow-requests/:id/accept')
  @HttpCode(HttpStatus.OK)
  async acceptFollowRequest(@Param('id') requestId: string, @Request() req: any) {
    try {
      await this.notificationService.acceptFollowRequest(requestId, req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Follow request accepted',
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow-requests/:id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectFollowRequest(@Param('id') requestId: string, @Request() req: any) {
    try {
      await this.notificationService.rejectFollowRequest(requestId, req.user.userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Follow request rejected',
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    try {
      const result = await this.notificationService.getNotifications(req.user.userId, 1, 1);
      return {
        statusCode: HttpStatus.OK,
        message: 'Unread count retrieved successfully',
        data: { count: result.unreadCount },
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('follow-requests/pending')
  async getPendingFollowRequests(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Request() req: any
  ) {
    try {
      const result = await this.notificationService.getFollowRequests(
        req.user.userId,
        parseInt(page),
        parseInt(limit)
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Pending follow requests retrieved successfully',
        data: result.requests,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('follow-request/:recipientId')
  @HttpCode(HttpStatus.OK)
  async cancelFollowRequest(
    @Param('recipientId') recipientId: string,
    @Request() req: any
  ) {
    try {
      await this.notificationService.cancelFollowRequest(req.user.userId, recipientId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Follow request cancelled',
      };
    } catch (error) {
      throw error;
    }
  }
}
