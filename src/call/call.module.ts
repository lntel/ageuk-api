import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { PatientsModule } from '../patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from '../staff/entities/staff.entity';
import { Call } from './entities/call.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Call, Staff]),
    StaffModule,
    NotificationsModule,
    PatientsModule
  ],
  controllers: [CallController],
  providers: [CallService]
})
export class CallModule {}
