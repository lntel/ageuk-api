import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

export default ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    ttl: configService.get<number>('rateLimit.ttl'),
    limit: configService.get<number>('rateLimit.limit'),
  }),
});
