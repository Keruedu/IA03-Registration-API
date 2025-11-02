import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: any }> {
    const { email, password } = registerDto;

    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new this.userModel({
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });

      const savedUser = await newUser.save();

      // Return user without password
      const userResponse = {
        id: savedUser._id,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      };

      return {
        message: 'User registered successfully',
        user: userResponse,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to register user. Please try again.',
      );
    }
  }
}
