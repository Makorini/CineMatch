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

    // Adicionar botão para criar novo filme
    const addButton = document.createElement("button");
    addButton.textContent = "Adicionar Novo Filme";
    addButton.classList.add('add-movie-btn');
    addButton.onclick = () => showAddMovieForm();
    resultsDiv.appendChild(addButton);

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
                    <div class="movie-actions">
                        <button onclick="editMovie('${movie.id}')" class="edit-btn">Editar</button>
                        <button onclick="deleteMovie('${movie.id}')" class="delete-btn">Excluir</button>
                    </div>
                </div>
            `;

            resultsDiv.appendChild(movieCard);
        });
    }
}

// Função para mostrar formulário de adicionar filme
function showAddMovieForm() {
    const formHtml = `
        <div class="movie-form-overlay">
            <div class="movie-form">
                <h3>Adicionar Novo Filme</h3>
                <form id="add-movie-form">
                    <input type="text" id="title" placeholder="Título" required>
                    <input type="text" id="director" placeholder="Diretor" required>
                    <input type="text" id="genres" placeholder="Gêneros (ex: Ação, Drama)" required>
                    <input type="text" id="duration" placeholder="Duração (ex: 120 minutos)" required>
                    <input type="number" id="year" placeholder="Ano" required>
                    <input type="url" id="image" placeholder="URL da Imagem (opcional)">
                    <div class="form-actions">
                        <button type="submit">Salvar</button>
                        <button type="button" onclick="closeMovieForm()">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
    
    document.getElementById('add-movie-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addMovie();
    });
}

// Função para adicionar filme
function addMovie() {
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const genres = (document.getElementById('genres') as HTMLInputElement).value;
    const language = (document.getElementById('language') as HTMLInputElement).value;
    const duration = (document.getElementById('duration') as HTMLInputElement).value;
    const year = parseInt((document.getElementById('year') as HTMLInputElement).value);
    const image = (document.getElementById('image') as HTMLInputElement).value || 'https://via.placeholder.com/180x270?text=No+Image';

    const movieData = { title, genres, language, duration, year, image };

    fetch('http://localhost:3002/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Filme adicionado:', data);
        closeMovieForm();
        // Recarregar a lista de filmes
        document.getElementById('preferences-form')?.dispatchEvent(new Event('submit'));
    })
    .catch(error => {
        console.error('Erro ao adicionar filme:', error);
        alert('Erro ao adicionar filme. Tente novamente.');
    });
}

// Função para editar filme
function editMovie(id: number) {
    const movie = allMovies.find(m => m.id === id);
    if (!movie) return;

    const formHtml = `
        <div class="movie-form-overlay">
            <div class="movie-form">
                <h3>Editar Filme</h3>
                <form id="edit-movie-form">
                    <input type="text" id="edit-title" value="${movie.title}" required>
                    <input type="text" id="edit-genres" value="${movie.genres}" required>
                    <input type="text" id="edit-language" value="${movie.language}" required>
                    <input type="text" id="edit-duration" value="${movie.duration}" required>
                    <input type="number" id="edit-year" value="${movie.year}" required>
                    <input type="url" id="edit-image" value="${movie.image}">
                    <div class="form-actions">
                        <button type="submit">Salvar</button>
                        <button type="button" onclick="closeMovieForm()">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
    
    document.getElementById('edit-movie-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        updateMovie(id);
    });
}

// Função para atualizar filme
function updateMovie(id: number) {
    const title = (document.getElementById('edit-title') as HTMLInputElement).value;
    const genres = (document.getElementById('edit-genres') as HTMLInputElement).value;
    const language = (document.getElementById('edit-language') as HTMLInputElement).value;
    const duration = (document.getElementById('edit-duration') as HTMLInputElement).value;
    const year = parseInt((document.getElementById('edit-year') as HTMLInputElement).value);
    const image = (document.getElementById('edit-image') as HTMLInputElement).value;

    const movieData = { title, genres, language, duration, year, image };

    fetch(`http://localhost:3002/movies/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Filme atualizado:', data);
        closeMovieForm();
        // Recarregar a lista de filmes
        document.getElementById('preferences-form')?.dispatchEvent(new Event('submit'));
    })
    .catch(error => {
        console.error('Erro ao atualizar filme:', error);
        alert('Erro ao atualizar filme. Tente novamente.');
    });
}

// Função para excluir filme
function deleteMovie(id: number) {
    if (!confirm('Tem certeza que deseja excluir este filme?')) return;

    fetch(`http://localhost:3002/movies/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Filme excluído:', data);
        // Recarregar a lista de filmes
        document.getElementById('preferences-form')?.dispatchEvent(new Event('submit'));
    })
    .catch(error => {
        console.error('Erro ao excluir filme:', error);
        alert('Erro ao excluir filme. Tente novamente.');
    });
}

// Função para fechar formulário
function closeMovieForm() {
    const overlay = document.querySelector('.movie-form-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Tornar as funções globais para que possam ser chamadas pelos botões
(window as any).editMovie = editMovie;
(window as any).deleteMovie = deleteMovie;
(window as any).closeMovieForm = closeMovieForm;
