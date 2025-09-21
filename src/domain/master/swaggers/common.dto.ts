import { ApiProperty } from '@nestjs/swagger';
import { AuthWithoutTokenDto } from './auth.dto';

export interface CommonRequestCustom extends Request {
  authData?: AuthWithoutTokenDto;
}

export class StatusDto {
  @ApiProperty()
  status: boolean;
}
