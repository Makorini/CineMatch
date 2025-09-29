import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: "https://cine-match-app.netlify.app"
  });

  await app.listen(3002);
}
bootstrap();