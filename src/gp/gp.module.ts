import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from '../patients/patients.module';
import { StaffModule } from '../staff/staff.module';
import { GP } from './entities/gp.entity';
import { GpController } from './gp.controller';
import { GpService } from './gp.service';

@Module({
  imports: [TypeOrmModule.forFeature([GP]), forwardRef(() => PatientsModule), StaffModule],
  controllers: [GpController],
  providers: [GpService],
  exports: [GpService]
})
export class GpModule {}
