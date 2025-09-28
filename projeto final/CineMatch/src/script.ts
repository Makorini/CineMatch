// Variável global para armazenar os filmes
let allMovies: any[] = [];

document.getElementById("preferences-form")?.addEventListener("submit", function (event) {
    console.log("Formulário de preferências submetido.");
    event.preventDefault(); // Impede o envio do formulário

    // Pega os valores do formulário
    const genre = (document.getElementById('genre') as HTMLSelectElement).value;
    const duration = (document.getElementById('duration') as HTMLInputElement).value;
    const year = (document.getElementById('year') as HTMLInputElement).value;
    const director = (document.getElementById('director') as HTMLInputElement).value;

    // Faz a requisição para o backend
    fetch("http://localhost:3002/movies") // <-- backend NestJS
        .then((res) => res.json())
        .then((movies) => {
            allMovies = movies; // Armazena todos os filmes
            // Filtra os filmes conforme preferências
            const filteredMovies = movies.filter((movie: any) => {
                return (
                    (genre === 'all' || (movie.genre && movie.genre.includes(genre))) &&
                    (!duration || (movie.runtime && parseInt(movie.runtime) <= Number(duration))) &&
                    (!year || (movie.releasedYear && movie.releasedYear >= Number(year))) &&
                    (!director || (movie.director && movie.director.toLowerCase().includes(director.toLowerCase())))
                );
            });

            // Exibe os filmes
            displayMovies(filteredMovies);
        })
        .catch((err) => {
            console.error("Erro ao buscar filmes:", err);
            const resultsDiv = document.getElementById('movie-results');
            if (resultsDiv) {
                resultsDiv.innerHTML = '<p>Erro ao carregar filmes. Tente novamente.</p>';
            }
        });
});

// Função para exibir os filmes na tela
function displayMovies(movies: any[]) {
    console.log("displayMovies chamada com:", movies);
    const resultsDiv = document.getElementById('movie-results');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = '';

    if (movies.length === 0) {
        const noMoviesMsg = document.createElement('p');
        noMoviesMsg.textContent = 'Nenhum filme encontrado.';
        resultsDiv.appendChild(noMoviesMsg);
    } else {
        movies.forEach((movie) => {
            const movieCard = document.createElement("div");
            console.log("Criando movieCard:", movie);
            movieCard.classList.add('movie-card');

            movieCard.innerHTML = `
                <img src="${movie.posterLink}" alt="${movie.seriesTitle}">
                <div class="info">
                    <h3>${movie.seriesTitle}</h3>
                    <p><strong>Descrição:</strong> ${movie.overview || "N/A"}</p>
                    <p><strong>Diretor:</strong> ${movie.director || "N/A"}</p>
                    <p><strong>Gênero:</strong> ${movie.genre}</p>
                    <p><strong>Duração:</strong> ${movie.runtime || "N/A"}</p>
                    <p><strong>Ano:</strong> ${movie.releasedYear || "N/A"}</p>
                    <p><strong>Nota:</strong> ${movie.imdbRating || "N/A"}</p>
                </div>
            `;

            resultsDiv.appendChild(movieCard);
        });
    }
}

// Função para fechar formulário
function closeMovieForm() {
    const overlay = document.querySelector('.movie-form-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Tornar as funções globais para que possam ser chamadas pelos botões
(window as any).closeMovieForm = closeMovieForm;
