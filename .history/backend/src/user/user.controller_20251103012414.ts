import { Controller, Post, Body, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // Log incoming payload for debugging validation issues (dev only)
    console.log('[USER REGISTER] payload:', JSON.stringify(registerDto));
    return this.userService.register(registerDto);
  }

  @Post('dev/delete')
  @HttpCode(HttpStatus.OK)
  async deleteByEmail(@Body() body: { email: string }) {
    // Only allow in non-production environments
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Not allowed in production');
    }
    const email = body?.email?.trim().toLowerCase();
    if (!email) return { deletedCount: 0 };
    const res = await this.userService.deleteByEmail(email);
    return res;
  }
}
