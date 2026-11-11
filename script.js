const API_KEY = "b8ff6274";
const BASE_URL = "https://www.omdbapi.com/";

const container = document.getElementById("movieContainer");
const input = document.getElementById("searchInput");
const details = document.getElementById("movieDetails");

async function searchMovies() {
    const movieName = input.value.trim();

    if (!movieName) {
        alert("Please enter a movie name!");
        return;
    }

    container.innerHTML = "<h2>Searching...</h2>";
    details.style.display = "none";

    try {
        const response = await fetch(
            `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(movieName)}&type=movie`
        );

        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            container.innerHTML = `<h2>${data.Error}</h2>`;
        }
    } catch (error) {
        container.innerHTML = "<h2>Something went wrong!</h2>";
    }
}

function displayMovies(movies) {
    container.innerHTML = "";

    movies.forEach(movie => {
        const poster = movie.Poster !== "N/A"
            ? movie.Poster
            : "https://placehold.co/300x450?text=No+Poster";

        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Year: ${movie.Year}</p>
                <p>Type: ${movie.Type}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            getMovieDetails(movie.imdbID);
        });

        container.appendChild(card);
    });
}

async function getMovieDetails(id) {
    try {
        const response = await fetch(
            `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`
        );

        const movie = await response.json();

        if (movie.Response === "True") {
            const poster = movie.Poster !== "N/A"
                ? movie.Poster
                : "https://placehold.co/300x450?text=No+Poster";

            details.innerHTML = `
                <img src="${poster}" alt="${movie.Title}">
                <h2>${movie.Title}</h2>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>Rating:</strong> ${movie.imdbRating}/10</p>
                <p><strong>Language:</strong> ${movie.Language}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
            `;

            details.style.display = "block";
            details.scrollIntoView({ behavior: "smooth" });
        }
    } catch (error) {
        alert("Unable to load movie details!");
    }
}

input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchMovies();
    }
});

searchMoviesInitial();

function searchMoviesInitial() {
    input.value = "Avengers";
    searchMovies();
}