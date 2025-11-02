import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() body: LoginDto, @Req() req: any) {
    // Log raw request body and headers to help debug payload issues (dev only)
    // eslint-disable-next-line no-console
    console.debug('[AuthController] raw headers:', req.headers);
    // eslint-disable-next-line no-console
    console.debug('[AuthController] raw body:', req.body);

    // Normalize email here to avoid case/whitespace mismatches
    const email = (body?.email || '').trim().toLowerCase();
    const password = body?.password;
    // eslint-disable-next-line no-console
    console.debug('[AuthController] login attempt for', { email });
    return this.authService.login(email, password);
  }

  @Post('auth/refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
    return this.authService.refresh(refreshToken);
  }

  @Get('me')
  async me(@Req() req: any) {
    const auth = req.headers?.authorization || '';
    const match = auth.match(/Bearer\s+(.*)$/i);
    if (!match) throw new UnauthorizedException('No token');
    const token = match[1];
    const decoded = this.authService.verifyToken(token);
    if (!decoded) throw new UnauthorizedException('Invalid token');
    return { user: { id: (decoded as any).sub, email: (decoded as any).email } };
  }
}
