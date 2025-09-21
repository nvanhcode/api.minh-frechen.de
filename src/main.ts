import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Setup MASTER Swagger
  const masterConfig = new DocumentBuilder()
    .setTitle('MASTER Service API')
    .setDescription('Master Service API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create MASTER document (filter only MASTER tags)
  const masterDocumentFactory = () => {
    const fullDocument = SwaggerModule.createDocument(app, masterConfig);
    const filteredPaths = {};
    Object.keys(fullDocument.paths).forEach((path) => {
      if (path.startsWith('/master/')) {
        filteredPaths[path] = fullDocument.paths[path];
      }
    });
    return {
      ...fullDocument,
      paths: filteredPaths,
    };
  };

  // Common Swagger UI CDN assets
  const swaggerUIAssets = {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  // Setup MASTER Swagger UI
  SwaggerModule.setup('swagger/master', app, masterDocumentFactory(), {
    ...swaggerUIAssets,
    jsonDocumentUrl: 'swagger/master/swagger.json',
  });

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, authorization, Content-Type, Accept',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 MASTER Swagger UI: http://localhost:${port}/swagger/master`);
  console.log(
    `📚 MASTER Swagger JSON: http://localhost:${port}/swagger/master/swagger.json`,
  );
}
bootstrap();
