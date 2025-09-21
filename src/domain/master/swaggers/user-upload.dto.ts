import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TimestampDto } from '../../../shared/swaggers/timestamp.dto';
import { BaseDisplayUserDto } from './base-display-user.dto';

@Expose()
export class UserUploadDto extends TimestampDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  folder: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  fileSize: number;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty({ type: () => BaseDisplayUserDto })
  user: BaseDisplayUserDto;
}
