import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Importe o PrismaModule

@Module({
  imports: [PrismaModule], // 2. Adicione o PrismaModule aqui
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
