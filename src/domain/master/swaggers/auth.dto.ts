import { ApiProperty } from '@nestjs/swagger';
import { BaseDisplayUserDto } from './base-display-user.dto';
import { Expose, Type } from 'class-transformer';

@Expose()
export class AuthWithoutTokenDto {
  @ApiProperty({ type: () => BaseDisplayUserDto })
  @Expose()
  @Type(() => BaseDisplayUserDto)
  user: BaseDisplayUserDto;
}

@Expose()
export class AuthDto extends AuthWithoutTokenDto {
  @ApiProperty()
  @Expose()
  token: string;
}
