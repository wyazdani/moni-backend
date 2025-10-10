import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  //global filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Moni')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, but recommended
      },
      'access-token', // This name is important for decorator usage
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: (a: string, b: string) => {
        return a.localeCompare(b);
      },
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
