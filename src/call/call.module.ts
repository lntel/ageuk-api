import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/staff/entities/staff.entity';
import { Call } from './entities/call.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { StaffModule } from 'src/staff/staff.module';

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
