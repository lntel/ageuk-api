import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/staff/entities/staff.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    PatientsModule
  ],
  controllers: [CallController],
  providers: [CallService]
})
export class CallModule {}
