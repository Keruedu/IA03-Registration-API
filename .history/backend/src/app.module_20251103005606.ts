import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/user-registration',
    ),
    UserModule,
    // Auth module provides login / refresh / me endpoints
    AuthModule,
    // Development helpers (list/delete users)
    DevModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
