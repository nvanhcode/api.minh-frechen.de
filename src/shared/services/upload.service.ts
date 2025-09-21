// lib/r2-uploader.ts
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

export interface UploadFileOptions {
  key: string; // Đường dẫn trong bucket (VD: 'uploads/image.jpg')
  body: Buffer | Readable;
  contentType?: string;
}

@Injectable()
export class R2UploaderService {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const s3Config: S3ClientConfig = {
      region: 'auto',
      endpoint: this.configService.get<string>('s3_cloud_endpoint'),
      credentials: {
        accessKeyId: this.configService.get<string>(
          's3_cloud_flare_access_key_id',
        ),
        secretAccessKey: this.configService.get<string>(
          's3_cloud_flare_secret_access_key',
        ),
      },
    };

    this.s3Client = new S3Client(s3Config);
  }

  public async uploadFile(options: UploadFileOptions): Promise<string> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.configService.get<string>('s3_cloud_flare_bucket'),
        Key: options.key,
        Body: options.body,
        ContentType: options.contentType || 'application/octet-stream',
      },
    });

    try {
      await upload.done();
      return `${this.configService.get<string>('s3_cloud_flare_pub_link')}/${options.key}`;
    } catch (error) {
      console.error('[R2Uploader] Upload failed:', error);
      return undefined;
    }
  }
}
