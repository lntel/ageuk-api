import { Module } from '@nestjs/common';
import { GpService } from './gp.service';
import { GpController } from './gp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GP } from './entities/gp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GP])],
  controllers: [GpController],
  providers: [GpService],
})
export class GpModule {}
