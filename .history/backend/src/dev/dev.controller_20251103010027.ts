import { Controller, Delete, Get, Body, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';

// Dev-only controller to inspect/reset users. Enabled only for non-production.
@Controller('dev/users')
export class DevController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Get()
  async list() {
    // return minimal information to avoid leaking passwords
    const users = await this.userModel.find().select('email createdAt').lean().exec();
    return { count: users.length, users };
  }

  @Delete()
  async remove(@Body() body: { email?: string }) {
    if (!body || !body.email) throw new BadRequestException('email is required');
    const res = await this.userModel.deleteOne({ email: body.email }).exec();
    return { deletedCount: res.deletedCount };
  }
}
