import { Controller, Post, Body, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import AuthLoginDTO from './dto/auth.dto';
import Tokens from './types/token';
import { GetCurrentUser } from 'src/common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body(new ValidationPipe()) loginData: AuthLoginDTO): Promise<Tokens> {
    return this.authService.login(loginData);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  logout() {
    this.authService.logout();
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  refresh(@GetCurrentUser() user) {
    return this.authService.refreshTokens(user.id, user.token);
  }
}
