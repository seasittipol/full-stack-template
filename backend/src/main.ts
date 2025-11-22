import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './common/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    app.setGlobalPrefix(configService.globalPrefix);

    // Enable CORS
    const corsConfig = configService.cors;
    app.enableCors({
      origin: corsConfig.origin,
      credentials: corsConfig.credentials,
    });

    // Setup Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Backend API')
      .setDescription('The Backend API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Start the application
    const port = configService.port;
    await app.listen(port);

    // Print configuration summary
    console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
