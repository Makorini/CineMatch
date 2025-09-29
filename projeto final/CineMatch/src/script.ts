// Variável global para armazenar os filmes
let allMovies: any[] = [];

// Submissão do formulário de preferências
document.getElementById("preferences-form")?.addEventListener("submit", function (event) {
    event.preventDefault();

    const genre = (document.getElementById('genre') as HTMLSelectElement).value;
    const duration = (document.getElementById('duration') as HTMLInputElement).value;
    const year = (document.getElementById('year') as HTMLInputElement).value;
    const director = (document.getElementById('director') as HTMLInputElement).value;

    fetch("http://localhost:3002/movies")
        .then(res => res.json())
        .then((movies: any[]) => {
            allMovies = movies;

            const filteredMovies = movies.filter(movie => {
                return (
                    (genre === 'all' || (movie.genre && movie.genre.includes(genre))) &&
                    (!duration || (movie.runtime && parseInt(movie.runtime) <= Number(duration))) &&
                    (!year || (movie.releasedYear && movie.releasedYear >= Number(year))) &&
                    (!director || (movie.director && movie.director.toLowerCase().includes(director.toLowerCase())))
                );
            });

            displayMovies(filteredMovies);
        })
        .catch(err => {
            console.error("Erro ao buscar filmes:", err);
            const resultsDiv = document.getElementById('movie-results');
            if (resultsDiv) resultsDiv.innerHTML = '<p>Erro ao carregar filmes. Tente novamente.</p>';
        });
});

// Função para exibir filmes na tela
function displayMovies(movies: any[]) {
    const resultsDiv = document.getElementById('movie-results');
    if (!resultsDiv) return;
    resultsDiv.innerHTML = '';

    // Botão para adicionar novo filme
    const addButton = document.createElement("button");
    addButton.textContent = "Adicionar Novo Filme";
    addButton.classList.add('add-movie-btn');
    addButton.onclick = showAddMovieForm;
    resultsDiv.appendChild(addButton);

    if (movies.length === 0) {
        const noMoviesMsg = document.createElement('p');
        noMoviesMsg.textContent = 'Nenhum filme encontrado.';
        resultsDiv.appendChild(noMoviesMsg);
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
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
                    <button onclick="editMovie(${movie.id})" class="edit-btn">Editar</button>
                    <button onclick="deleteMovie(${movie.id})" class="delete-btn">Excluir</button>
                </div>
            </div>
        `;
        resultsDiv.appendChild(movieCard);
    });
}

// Mostrar formulário para adicionar filme
function showAddMovieForm() {
    const formHtml = `
        <div class="movie-form-overlay">
            <div class="movie-form">
                <h3>Adicionar Novo Filme</h3>
                <form id="add-movie-form">
                    <input type="text" id="title" placeholder="Título" required>
                    <input type="text" id="director" placeholder="Diretor" required>
                    <input type="text" id="genres" placeholder="Gêneros" required>
                    <input type="text" id="duration" placeholder="Duração" required>
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

// Adicionar filme
function addMovie() {
    const seriesTitle = (document.getElementById('title') as HTMLInputElement).value;
    const genre = (document.getElementById('genres') as HTMLInputElement).value;
    const director = (document.getElementById('director') as HTMLInputElement).value;
    const runtime = (document.getElementById('duration') as HTMLInputElement).value;
    const releasedYear = parseInt((document.getElementById('year') as HTMLInputElement).value);
    const posterLink = (document.getElementById('image') as HTMLInputElement).value || 'https://via.placeholder.com/180x270?text=No+Image';

    const movieData = {
        seriesTitle,
        genre,
        director,
        runtime,
        releasedYear,
        posterLink
    };


    fetch('http://localhost:3002/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Filme adicionado:', data);
        closeMovieForm();
        document.getElementById('preferences-form')?.dispatchEvent(new Event('submit'));
    })
    .catch(err => {
        console.error('Erro ao adicionar filme:', err);
        alert('Erro ao adicionar filme. Tente novamente.');
    });
}

// Editar filme
function editMovie(id: number) {
    const movie = allMovies.find(m => m.id === id);
    if (!movie) { alert('Filme não encontrado!'); return; }

    const formHtml = `
        <div class="movie-form-overlay">
            <div class="movie-form">
                <h3>Editar Filme</h3>
                <form id="edit-movie-form">
                    <input type="text" id="edit-title" value="${movie.seriesTitle}" required>
                    <input type="text" id="edit-director" value="${movie.director}" required>
                    <input type="text" id="edit-genre" value="${movie.genre}" required>
                    <input type="text" id="edit-runtime" value="${movie.runtime}" required>
                    <input type="number" id="edit-year" value="${movie.releasedYear}" required>
                    <input type="url" id="edit-image" value="${movie.posterLink}">
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

// Atualizar filme
function updateMovie(id: number) {
    const seriesTitle = (document.getElementById('edit-title') as HTMLInputElement).value;
    const director = (document.getElementById('edit-director') as HTMLInputElement).value;
    const genre = (document.getElementById('edit-genre') as HTMLInputElement).value;
    const runtime = (document.getElementById('edit-runtime') as HTMLInputElement).value;
    const releasedYear = parseInt((document.getElementById('edit-year') as HTMLInputElement).value);
    const posterLink = (document.getElementById('edit-image') as HTMLInputElement).value;

    const movieData = { seriesTitle, director, genre, runtime, releasedYear, posterLink };

    fetch(`http://localhost:3002/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Filme atualizado:', data);
        closeMovieForm();
        document.getElementById('preferences-form')?.dispatchEvent(new Event('submit'));
    })
    .catch(err => {
        console.error('Erro ao atualizar filme:', err);
        alert('Erro ao atualizar filme. Tente novamente.');
    });
}

// Excluir filme
function deleteMovie(id: number) {
    if (!confirm('Tem certeza que deseja excluir este filme?')) return;

    fetch(`http://localhost:3002/movies/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            console.log('Filme excluído:', data);
            document.getElementById('preferences-form')?.dispatchEvent(new Event('submit'));
        })
        .catch(err => {
            console.error('Erro ao excluir filme:', err);
            alert('Erro ao excluir filme. Tente novamente.');
        });
}

// Fechar formulário
function closeMovieForm() {
    const overlay = document.querySelector('.movie-form-overlay');
    if (overlay) overlay.remove();
}

// Tornar funções globais
(window as any).editMovie = editMovie;
(window as any).deleteMovie = deleteMovie;
(window as any).closeMovieForm = closeMovieForm;