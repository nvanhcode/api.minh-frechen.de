import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { CommonRequestCustom } from '@/domain/master/swaggers/common.dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredPermission = this.reflector.get(
        'permission',
        context.getHandler(),
      );

      if (!requiredPermission) {
        return true; // No permission required
      }

      const request = context
        .switchToHttp()
        .getRequest() as CommonRequestCustom;

      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new ForbiddenException('Access token required');
      }

      const payload: { id: number } = this.jwtService.verify(token);

      // get me auth data
      const authData = await this.authService.getAuthData(payload.id);
      request.authData = authData;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
