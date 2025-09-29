import { Controller, Get } from '@nestjs/common';

@Controller() // <-- decorator correto
export class AppController {
  @Get()
  redirectToMovies() {
    return { message: "Acesse /movies para ver os filmes" };
  }
}
