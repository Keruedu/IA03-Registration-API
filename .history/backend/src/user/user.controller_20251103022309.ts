import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // Log incoming payload for debugging validation issues
    // (Remove or guard this in production)
    // eslint-disable-next-line no-console
    console.log('[USER REGISTER] payload:', JSON.stringify(registerDto));
    return this.userService.register(registerDto);
  }
}
