import { SetMetadata } from '@nestjs/common';

export const RequirePermission = () => SetMetadata('permission', true);
