import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ALL_MODELS } from './models';
import { setupConfigTypeOrm } from '@/shared/config/typeorm.config';
import { ConstDomain } from './const.domain';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => setupConfigTypeOrm(ConstDomain.APP_NAME),
    }),
    TypeOrmModule.forFeature(ALL_MODELS),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class MASTERDomain {
  static forRoot() {
    return {
      module: MASTERDomain,
      global: true,
    };
  }
}
