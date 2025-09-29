import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para o frontend Netlify
  app.enableCors({
    origin: "https://cine-match-app.netlify.app"
  });

  const port = process.env.PORT || 3002; // porta dinâmica
  await app.listen(port);
}
bootstrap();
