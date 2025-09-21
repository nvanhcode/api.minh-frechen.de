import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PermissionGuard } from './guards/permission.guard';
import { ALL_MODELS } from '@/domain/master/models';
import { R2UploaderService } from '@/shared/services/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(ALL_MODELS),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [R2UploaderService, AuthService, PermissionGuard],
  exports: [AuthService, PermissionGuard, JwtModule],
})
export class AuthModule {}
