import { ApiProperty } from '@nestjs/swagger';
import { TimestampDto } from '../../../shared/swaggers/timestamp.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BaseDisplayUserDto extends TimestampDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  avatar?: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  fullname: string;
}
