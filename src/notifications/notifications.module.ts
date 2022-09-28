import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { forwardRef } from '@nestjs/common/utils';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), forwardRef(() => StaffModule)],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
