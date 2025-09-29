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
  return this.prisma.movie.create({
    data: {
      seriesTitle: data.seriesTitle || "",
      genre: data.genre || "",
      director: data.director || "",
      runtime: data.runtime || "",
      releasedYear: data.releasedYear || 0, // ou algum valor padrão
      posterLink: data.posterLink || "",
      certificate: data.certificate || "",
      imdbRating: data.imdbRating || 0,
      overview: data.overview || "",
      metaScore: data.metaScore || 0,
      gross: data.gross || "",
    },
  });
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