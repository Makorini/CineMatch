document.getElementById('preferences-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const genre = document.getElementById('genre').value;
    const language = document.getElementById('language').value;
    const duration = document.getElementById('duration').value;
    const year = document.getElementById('year').value;

    const movies = [
        { 
            title: 'Vingadores: Ultimato', 
            genre: 'action', 
            language: 'en', 
            duration: 181, 
            year: 2019, 
            image: 'https://via.placeholder.com/180x270?text=Vingadores' 
        },
        { 
            title: 'A Era do Gelo', 
            genre: 'comedy', 
            language: 'pt', 
            duration: 100, 
            year: 2002, 
            image: 'https://via.placeholder.com/180x270?text=A+Era+do+Gelo' 
        },
        { 
            title: 'O Exorcista', 
            genre: 'horror', 
            language: 'en', 
            duration: 122, 
            year: 1973, 
            image: 'https://via.placeholder.com/180x270?text=O+Exorcista' 
        },
        { 
            title: 'Titanic', 
            genre: 'romance', 
            language: 'es', 
            duration: 195, 
            year: 1997, 
            image: 'https://via.placeholder.com/180x270?text=Titanic' 
        },
        { 
            title: 'O Poderoso Chefão', 
            genre: 'drama', 
            language: 'en', 
            duration: 175, 
            year: 1972, 
            image: 'https://via.placeholder.com/180x270?text=O+Poderoso+Chefao' 
        }
    ];

    const filteredMovies = movies.filter(movie => {
        return (
            (genre === 'all' || movie.genre === genre) &&
            (language === 'all' || movie.language === language) &&
            (!duration || movie.duration <= duration) &&
            (!year || movie.year >= year)
        );
    });

    displayMovies(filteredMovies);
});

function displayMovies(movies) {
    const resultsDiv = document.getElementById('movie-results');
    resultsDiv.innerHTML = '';

    if (movies.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum filme encontrado.</p>';
    } else {
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            movieCard.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <div class="info">
                    <h3>${movie.title}</h3>
                    <p><strong>Gênero:</strong> ${movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)}</p>
                    <p><strong>Idioma:</strong> ${movie.language.toUpperCase()}</p>
                    <p><strong>Duração:</strong> ${movie.duration} min</p>
                    <p><strong>Ano:</strong> ${movie.year}</p>
                </div>
            `;

            resultsDiv.appendChild(movieCard);
        });
    }
}
