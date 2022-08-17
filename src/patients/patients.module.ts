import { forwardRef, Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { GP } from '../gp/entities/gp.entity';
import { GpService } from 'src/gp/gp.service';
import { GpModule } from 'src/gp/gp.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), forwardRef(() => GpModule)],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService]
})
export class PatientsModule {}
