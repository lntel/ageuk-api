import { forwardRef, Module } from '@nestjs/common';
import { GpService } from './gp.service';
import { GpController } from './gp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GP } from './entities/gp.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { RolesModule } from 'src/roles/roles.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [TypeOrmModule.forFeature([GP]), forwardRef(() => PatientsModule), StaffModule],
  controllers: [GpController],
  providers: [GpService],
  exports: [GpService]
})
export class GpModule {}
