import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import rateLimitConfig from './config/rateLimit.config';
import ormConfig from './config/typeorm.config';
import { GpModule } from './gp/gp.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PatientsModule } from './patients/patients.module';
import { RolesModule } from './roles/roles.module';
import { StaffModule } from './staff/staff.module';
import { TasksModule } from './tasks/tasks.module';

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
    RolesModule,
    NotificationsModule,
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
