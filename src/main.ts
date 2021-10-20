import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
//  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
//   transport: Transport.REDIS,
//   options: {
//     url: 'redis://localhost:6379',
//   },
// });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'resource/views'));
  const config = new DocumentBuilder().setTitle('Example')
    .setDescription('The example description')
    .setVersion('1.0')
    .addTag('example')
    .addBearerAuth({
      type:'http',scheme:'bearer',bearerFormat:'Token'
    },'access-token')
    .addCookieAuth('authCookie', {
      type: 'http',
      in: 'Header',
      scheme: 'Brearer'
    })
    .build();
  app.enableCors({
    origin:'http://localhost:8080',
    credentials:true
  });
  app.useGlobalFilters(new HttpExceptionFilter)
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({transform:true}));
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService=app.get(ConfigService)
  await app.listen(configService.get('PORT'));
}
bootstrap();
