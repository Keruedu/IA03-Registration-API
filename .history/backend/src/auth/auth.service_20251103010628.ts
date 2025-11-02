import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from '../user/schemas/user.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    // Narrow the mongoose document to UserDocument so TypeScript recognizes _id and password
    const u = user as UserDocument;
    const match = await bcrypt.compare(password, u.password as string);
    if (!match) return null;
    return { id: u._id?.toString ? u._id.toString() : String(u._id), email: u.email };
  }

  createAccessToken(payload: object) {
    // short lived access token (15 minutes)
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  createRefreshToken(payload: object) {
    // longer lived refresh token (7 days)
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return null;
    }
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.createAccessToken({ sub: user.id, email: user.email });
    const refreshToken = this.createRefreshToken({ sub: user.id, email: user.email });

    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken: string) {
    const decoded = this.verifyToken(refreshToken);
    if (!decoded) throw new UnauthorizedException('Invalid refresh token');
    // Issue a new access token
    const accessToken = this.createAccessToken({ sub: (decoded as any).sub, email: (decoded as any).email });
    return { accessToken };
  }
}
