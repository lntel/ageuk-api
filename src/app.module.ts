import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './staff/entities/staff.entity';
import { StaffModule } from './staff/staff.module';
import { PatientsModule } from './patients/patients.module';
import { Patient } from './patients/entities/patient.entity';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Referral } from './patients/entities/referral.entity';
import { GP } from './gp/entities/gp.entity';
import { GpModule } from './gp/gp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('rateLimit.ttl'),
        limit: configService.get<number>('rateLimit.limit'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [Staff, Patient, Referral, GP],
        synchronize: true,
      }),
    }),
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
