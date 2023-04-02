import { Body, Controller, Get, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { GetCurrentUser } from '../common/decorators/get-user.decorator';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { UpdateStaffDto } from '../staff/dto/update-staff.dto';
import { StaffService } from '../staff/staff.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import AuthLoginDTO from './dto/auth.dto';
import Tokens from './types/token';

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
    return this.staffService.updateProfile(user, updateStaffDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  refresh(@GetCurrentUser() user) {
    return this.authService.refreshTokens(user.id, user.token);
  }
}
