import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  const moviesDataPath = path.join(__dirname, '../movies_data.json');
  const movies = JSON.parse(fs.readFileSync(moviesDataPath, 'utf-8'));

  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        posterLink: movie.posterLink || undefined,
        seriesTitle: movie.seriesTitle,
        releasedYear: movie.releasedYear ? Number(movie.releasedYear) : null,
        certificate: movie.certificate || null,
        runtime: movie.runtime || null,
        genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre || "",
        imdbRating: movie.imdbRating ? Number(movie.imdbRating) : null,
        overview: movie.overview || null,
        metaScore: movie.metaScore ? Number(movie.metaScore) : null,
        director: movie.director || null,
        star1: movie.star1 || null,
        star2: movie.star2 || null,
        star3: movie.star3 || null,
        star4: movie.star4 || null,
        noOfVotes: movie.noOfVotes ? Number(movie.noOfVotes) : null,
        gross: movie.gross ? String(movie.gross) : null,
      },
    });
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });