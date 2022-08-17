import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './staff/entities/staff.entity';
import { StaffModule } from './staff/staff.module';
import { PatientsModule } from './patients/patients.module';
import { Patient } from './patients/entities/patient.entity';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { GP } from './gp/entities/gp.entity';
import { GpModule } from './gp/gp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import ormConfig from './config/typeorm.config';
import rateLimitConfig from './config/rateLimit.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    rateLimitConfig,
    ormConfig,
    StaffModule,
    PatientsModule,
    GpModule,
    AuthModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
