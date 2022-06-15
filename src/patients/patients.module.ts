import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { GP } from '../gp/entities/gp.entity';
import { Referral } from './entities/referral.entity';
import { GpService } from 'src/gp/gp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, GP, Referral])],
  controllers: [PatientsController],
  providers: [PatientsService, GpService],
})
export class PatientsModule {}
