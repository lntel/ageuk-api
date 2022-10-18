import { Controller, Post, Body, UseGuards, ValidationPipe, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import AuthLoginDTO from './dto/auth.dto';
import Tokens from './types/token';
import { GetCurrentUser } from 'src/common/decorators/get-user.decorator';
import { StaffService } from 'src/staff/staff.service';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Staff } from 'src/staff/entities/staff.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly staffService: StaffService) {}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Login for staff members' })
  @ApiResponse({ status: 200, description: 'The access and refresh JWT tokens for the staff member' })
  login(@Body(new ValidationPipe()) loginData: AuthLoginDTO): Promise<Tokens> {
    return this.authService.login(loginData);
  }

  // TODO implement this
  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  @ApiOperation({ summary: 'Logout for staff members' })
  @ApiResponse({ status: 200 })
  logout() {
    this.authService.logout();
  }
  
  @UseGuards(AccessTokenGuard)
  @Get('/profile')
  @ApiOperation({ summary: 'Get the current staff member profile' })
  @ApiResponse({ status: 200, type: Staff })
  @ApiBearerAuth()
  getCurrentUser(@GetCurrentUser() user) {
    return this.staffService.getCurrentUser(user);
  }
  
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, schema: {
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    }
  } })
  refresh(@GetCurrentUser() user) {
    return this.authService.refreshTokens(user.id, user.token);
  }
}
