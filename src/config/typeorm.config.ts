import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GP } from 'src/gp/entities/gp.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { DataSource } from 'typeorm';

// https://docs.nestjs.com/techniques/database#migrations

export default TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.name'),
    entities: [`${__dirname}/../**/*.{ts,js}`],
    migrations: ['src/migrations/*.ts'],
    synchronize: true,
  }),
  dataSourceFactory: async (options) => {
    const dataSource = await new DataSource(options).initialize();
    return dataSource;
  },
});
