import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, PostsModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
