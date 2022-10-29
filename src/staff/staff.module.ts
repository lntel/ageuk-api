import { forwardRef, Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Staff } from './entities/staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/roles/roles.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    forwardRef(() => RolesModule),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService]
})
export class StaffModule {}
