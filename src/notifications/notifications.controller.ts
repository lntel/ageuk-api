import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Sse, UseGuards } from '@nestjs/common/decorators';
import { SkipThrottle } from '@nestjs/throttler';
import { GetCurrentUser } from '../common/decorators/get-user.decorator';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@UseGuards(AccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll(@GetCurrentUser() user: any) {
    return this.notificationsService.findAllFromUser(user);
  }

  @SkipThrottle()
  @Sse('sse')
  sse(@GetCurrentUser() user: any) {
    return this.notificationsService.sse(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notificationsService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.notificationsService.update(+id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationsService.remove(+id);
  // }
}
