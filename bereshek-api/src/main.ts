import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://bereshek.vercel.app',
      'https://www.bereshek.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Включаем валидацию
  app.useGlobalPipes(new ValidationPipe());

  // Настраиваем Swagger
  const config = new DocumentBuilder()
    .setTitle('Bereshek API')
    .setDescription('API для управления долгами')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Запускаем на порту из переменной окружения или 3001
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
