import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MASTERDomain } from './domain/master/master.domain';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MASTERDomain.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
