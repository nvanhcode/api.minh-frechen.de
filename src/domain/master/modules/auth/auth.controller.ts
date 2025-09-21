import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { File as MulterFile } from 'multer';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PermissionGuard } from './guards/permission.guard';
import { RequirePermission } from '@/shared/decorators/permission.decorator';
import { CommonRequestCustom } from '@/domain/master/swaggers/common.dto';
import { Auth } from '@/domain/master/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserUploadDto } from '@/domain/master/swaggers/user-upload.dto';
import { UploadApiFile } from '@/domain/master/decorators/upload-file.decorator';
import { plainToInstance } from 'class-transformer';
import { BaseDisplayUserDto } from '@/domain/master/swaggers/base-display-user.dto';
import { UpdateMeDto } from './dto/me.dto';
import { AuthDto, AuthWithoutTokenDto } from '../../swaggers/auth.dto';

@ApiTags('Auth')
@Controller('master/auth')
@UseGuards(PermissionGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 200, type: AuthDto })
  login(@Body() loginDto: LoginDto): Promise<AuthDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @Auth()
  @RequirePermission()
  @ApiResponse({ status: 200, type: AuthWithoutTokenDto })
  getMe(@Req() req: CommonRequestCustom): AuthWithoutTokenDto {
    return req.authData!;
  }

  @Post()
  @Auth()
  @RequirePermission()
  @ApiResponse({ status: 200, type: BaseDisplayUserDto })
  async create(
    @Req() req: CommonRequestCustom,
    @Body() updateDto: UpdateMeDto,
  ) {
    return plainToInstance(
      BaseDisplayUserDto,
      await this.authService.update(req.authData, updateDto),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Post('upload')
  @Auth()
  @RequirePermission()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @UploadApiFile('file')
  @ApiResponse({
    status: 200,
    type: UserUploadDto,
  })
  async process(
    @Body('folder') folder: string,
    @Req() req: CommonRequestCustom,
    @UploadedFile() file: MulterFile,
  ) {
    return plainToInstance(
      UserUploadDto,
      await this.authService.uploadFileToR2(file, folder, req.authData),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
