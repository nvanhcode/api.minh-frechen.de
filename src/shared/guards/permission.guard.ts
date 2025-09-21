import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CommonRequestCustom, AuthWithoutTokenDto } from '../dto/auth.dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context
        .switchToHttp()
        .getRequest() as CommonRequestCustom;

      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new ForbiddenException('Access token required');
      }

      // get me auth data
      request.authData = await this.getAuthData(request, token);

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

  private async getAuthData(
    request: any,
    token: string,
  ): Promise<AuthWithoutTokenDto> {
    const host = request.get('host');
    const protocol = request.protocol || 'http';

    // Tạo URL để gọi API me tương ứng
    const meEndpoint = `${protocol}://${host}/iam/auth/me`;

    // Gọi API me với token bearer
    try {
      const response = await fetch(meEndpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ForbiddenException('Failed to fetch auth data');
      }

      const authData = await response.json();
      return authData as AuthWithoutTokenDto;
    } catch {
      throw new ForbiddenException('Invalid token or auth service unavailable');
    }
  }
}
