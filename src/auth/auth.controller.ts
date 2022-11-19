import { Controller, Post, Body, UseGuards, ValidationPipe, Request, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import AuthLoginDTO from './dto/auth.dto';
import Tokens from './types/token';
import { GetCurrentUser } from 'src/common/decorators/get-user.decorator';
import { StaffService } from 'src/staff/staff.service';
import { Public } from './decorators/public.decorator';
import { UpdateStaffDto } from 'src/staff/dto/update-staff.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly staffService: StaffService) {}

  @Public()
  @Post('/login')
  login(@Body(new ValidationPipe()) loginData: AuthLoginDTO): Promise<Tokens> {
    return this.authService.login(loginData);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  logout() {
    this.authService.logout();
  }
  
  @UseGuards(AccessTokenGuard)
  @Get('/profile')
  getCurrentUser(@GetCurrentUser() user) {
    return this.staffService.getCurrentUser(user);
  }
  
  @UseGuards(AccessTokenGuard)
  @Patch('/profile')
  updateProfile(@GetCurrentUser() user, @Body(new ValidationPipe()) updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(user.sub, updateStaffDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  refresh(@GetCurrentUser() user) {
    return this.authService.refreshTokens(user.id, user.token);
  }
}
