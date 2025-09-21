import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@/domain/master/models/user.entity';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { File as MulterFile } from 'multer';
import { remove as removeDiacritics } from 'diacritics';
import { UpdateMeDto } from './dto/me.dto';
import { BaseDisplayUserDto } from '@/domain/master/swaggers/base-display-user.dto';
import { UserUpload } from '../../models/user-upload.entity';
import { AuthDto, AuthWithoutTokenDto } from '../../swaggers/auth.dto';
import { R2UploaderService } from '@/shared/services/upload.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserUpload)
    private readonly userUploadRepository: Repository<UserUpload>,
    private readonly jwtService: JwtService,
    private readonly r2UploaderService: R2UploaderService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthDto> {
    const user = await this.userRepository.findOne({
      where: [{ email: loginDto.userName }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: user.id,
    });

    const authData = await this.getAuthData(user.id);

    return {
      token,
      ...authData,
    };
  }

  async getAuthData(uId: number): Promise<AuthWithoutTokenDto> {
    const user = await this.userRepository.findOne({
      where: { id: uId },
      relations: [],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return plainToInstance(
      AuthWithoutTokenDto,
      {
        user,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  private sanitizeFileName(originalName: string): string {
    const timestamp = Date.now();
    const ext = originalName.substring(originalName.lastIndexOf('.'));
    let name = originalName.substring(0, originalName.lastIndexOf('.'));
    name = removeDiacritics(name); // Chuyển về không dấu
    name = name.replace(/[^a-zA-Z0-9\s]/g, ''); // Loại bỏ ký tự đặc biệt
    name = name.replace(/\s+/g, '_'); // Thay dấu cách bằng _
    return `${timestamp}_${name}${ext}`;
  }

  async update(
    auth: AuthWithoutTokenDto,
    updateMeDto: UpdateMeDto,
  ): Promise<BaseDisplayUserDto> {
    const user = await this.userRepository.findOne({
      where: [{ id: auth.user.id }],
    });
    // Hash password if provided
    if (updateMeDto.password) {
      updateMeDto.password = await bcrypt.hash(updateMeDto.password, 10);
    }

    // Update user
    const updated = Object.assign(user, updateMeDto);
    await this.userRepository.save(updated);

    return Object.assign(auth.user, updateMeDto);
  }

  async uploadFileToR2(
    file: MulterFile,
    folder: string,
    auth: AuthWithoutTokenDto,
  ): Promise<UserUpload> {
    const sanitizedFileName = this.sanitizeFileName(file.originalname);
    const uploadResult = await this.r2UploaderService.uploadFile({
      key: `${folder}/${auth.user.id}/${sanitizedFileName}`,
      body: file.buffer,
      contentType: file.mimetype,
    });

    if (!uploadResult) {
      throw new Error('Upload failed');
    }

    const userUpload = new UserUpload();
    userUpload.url = uploadResult;
    userUpload.name = file.originalname;
    userUpload.fileSize = file.size;
    userUpload.userId = auth.user.id;
    userUpload.folder = folder;

    return await this.userUploadRepository.save(userUpload);
  }
}
