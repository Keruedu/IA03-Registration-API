import { Controller, Get, Delete, Param, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';

@Controller('dev')
export class DevController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Return list of users (development only)
  @Get('users')
  async listUsers() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Not allowed in production');
    }
    const users = await this.userModel.find({}, { password: 0 }).lean().exec();
    return { users };
  }

  // Delete user by email (development only)
  @Delete('users/:email')
  async deleteUser(@Param('email') email: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Not allowed in production');
    }
    const res = await this.userModel.deleteOne({ email }).exec();
    return { deletedCount: res.deletedCount };
  }
}
