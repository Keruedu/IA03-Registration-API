import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // Log incoming payload for debugging validation issues (dev only)
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[USER REGISTER] payload:', JSON.stringify(registerDto));
    }
    return this.userService.register(registerDto);
  }

  // Dev-only: list users (without passwords)
  // Use: GET /user/dev/list
  @Get('dev/list')
  async listUsers() {
    if (process.env.NODE_ENV === 'production') return { message: 'Not allowed' };
    return this.userService.listAll();
  }

  // Dev-only: delete user by email - POST body { email }
  @Post('dev/delete')
  async deleteUser(@Body() body: { email: string }) {
    if (process.env.NODE_ENV === 'production') return { message: 'Not allowed' };
    return this.userService.deleteByEmail(body.email);
  }
}
