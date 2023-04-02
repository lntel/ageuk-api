import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { NotificationsService } from '../notifications/notifications.service';
import { StaffService } from '../staff/staff.service';
import AuthLoginDTO from './dto/auth.dto';
import Tokens from './types/token';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private staffService: StaffService,
    private notificationService: NotificationsService,
  ) {}

  async getTokens(staffId: number, emailAddress: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: staffId,
        emailAddress,
      },
      {
        secret: this.configService.get<string>('jwt.accessToken.secret'),
        expiresIn: this.configService.get<string>('jwt.accessToken.expiresIn'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: staffId,
        emailAddress,
      },
      {
        secret: this.configService.get<string>('jwt.refreshToken.secret'),
        expiresIn: this.configService.get<string>('jwt.refreshToken.expiresIn'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginData: AuthLoginDTO): Promise<Tokens> {
    const { emailAddress, password } = loginData;

    const staff = await this.staffService.findOneBy(
      'emailAddress',
      emailAddress,
    );

    if (!staff)
      throw new HttpException(
        'This email address is not within our system',
        HttpStatus.UNAUTHORIZED,
      );

    const passwordsMatch = compareSync(password, staff.password);

    if(!passwordsMatch)
        throw new HttpException('You have entered invalid credentials, please try again', HttpStatus.UNAUTHORIZED);

    await this.notificationService.create({
      staff: staff.id,
      content: 'Your account has been accessed'
    });

    const tokens = this.getTokens(staff.id, emailAddress);

    return tokens;
  }

  logout() {}

  async refreshTokens(staffId: number, refreshToken: string): Promise<Tokens> {

    const staff = await this.staffService.findOne(staffId);

    try {
      const { sub } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshToken.secret')
      });

      const tokens = this.getTokens(sub, staff.emailAddress);

      return tokens;
      
    } catch (error) {
      
    }
  }
}
