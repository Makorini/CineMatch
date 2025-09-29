import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Movie } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany();
  }

  async create(data: CreateMovieDto): Promise<Movie> {
    return this.prisma.movie.create({ data });
  }

  async update(id: string, data: Partial<CreateMovieDto>): Promise<Movie> {
    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Movie> {
    return this.prisma.movie.delete({ where: { id } });
  }
}