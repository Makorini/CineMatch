import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Movie } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany();
  }
}
