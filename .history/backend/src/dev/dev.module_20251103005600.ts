import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevController } from './dev.controller';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [DevController],
})
export class DevModule {}
