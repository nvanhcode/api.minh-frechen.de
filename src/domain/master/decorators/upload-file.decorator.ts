import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export const UploadApiFile = (
  fileName: string,
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            nullable: false,
            format: 'binary',
          },
          folder: {
            type: 'string',
            nullable: false,
            enum: ['avatar'],
          },
        },
      },
    }),
  );
};
