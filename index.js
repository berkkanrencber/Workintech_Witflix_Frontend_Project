const API_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = ""; // Enter your bearer token
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${BEARER_TOKEN}`
    }
};

async function getPopularMovies() {
    try {
        const response = await fetch(`${API_URL}/movie/popular`, options);
        const data = await response.json();
        displayPopularMovies(data.results)
    } catch (error) {
        console.log(error);
    }
}

async function getRecommendedMovies() {
    try {
        const response = await fetch(`${API_URL}/movie/top_rated`, options);
        const data = await response.json();
        displayRecommendedMovies(data.results)
    } catch (error) {
        console.log(error);
    }
}

function displayPopularMovies(movies) {
    const suggestionMovies = document.getElementById("suggestion-movies-popular");

    suggestionMovies.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${IMAGE_BASE_URL}${movie.backdrop_path})`;
        movieCard.style.backgroundSize = 'cover';
        movieCard.style.backgroundPosition = 'center';

        const movieDetailContainer = document.createElement('div');
        movieDetailContainer.classList.add('movie-detail-container');

        const movieTitle = document.createElement('h4');
        movieTitle.textContent = movie.original_title;

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');

        const contentRating = document.createElement('span');
        contentRating.classList.add('content-rating');
        contentRating.textContent = `${parseFloat(movie.vote_average).toFixed(1)} Rating`;

        const movieDuration = document.createElement('span');
        movieDuration.classList.add('movie-duration');
        movieDuration.textContent = generateRandomDuration();

        const playButton = document.createElement('button');
        playButton.innerHTML = `<i class="fa-solid fa-play"></i> Play Now`;

        movieInfo.appendChild(contentRating);
        movieInfo.appendChild(movieDuration);

        movieDetailContainer.appendChild(movieTitle);
        movieDetailContainer.appendChild(movieInfo);
        movieDetailContainer.appendChild(playButton);

        movieCard.appendChild(movieDetailContainer);

        suggestionMovies.appendChild(movieCard);
    })

    displayHeroVideo(movies[0].id);
    getHeroMovieDetails(movies[0].id);
}


function displayRecommendedMovies(movies) {
    const suggestionMovies = document.getElementById("suggestion-movies-recommended");

    suggestionMovies.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${IMAGE_BASE_URL}${movie.backdrop_path})`;
        movieCard.style.backgroundSize = 'cover';
        movieCard.style.backgroundPosition = 'center';

        const movieDetailContainer = document.createElement('div');
        movieDetailContainer.classList.add('movie-detail-container');

        const movieTitle = document.createElement('h4');
        movieTitle.textContent = movie.original_title;

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');

        const contentRating = document.createElement('span');
        contentRating.classList.add('content-rating');
        contentRating.textContent = `${parseFloat(movie.vote_average).toFixed(1)} Rating`;

        const movieDuration = document.createElement('span');
        movieDuration.classList.add('movie-duration');
        movieDuration.textContent = generateRandomDuration();

        const playButton = document.createElement('button');
        playButton.innerHTML = `<i class="fa-solid fa-play"></i> Play Now`;

        movieInfo.appendChild(contentRating);
        movieInfo.appendChild(movieDuration);

        movieDetailContainer.appendChild(movieTitle);
        movieDetailContainer.appendChild(movieInfo);
        movieDetailContainer.appendChild(playButton);

        movieCard.appendChild(movieDetailContainer);

        suggestionMovies.appendChild(movieCard);
    })
}

async function getHeroMovieDetails(movie_id) {
    try {
        const response = await fetch(`${API_URL}/movie/${movie_id}?language=en-US`, options);
        const data = await response.json();
        displayHeroMovieDetails(data);
    } catch (error) {
        console.log(error);
    }
}

async function displayHeroMovieDetails(movie){
    const movieName = document.getElementById('movie-name');
    const userRating = document.getElementById('user-rating');
    const contentRating = document.getElementById('content-rating');
    const movieDuration = document.getElementById('movie-duration');
    const movieDescription = document.getElementById('movie-description');
    const movieCast = document.getElementById('movie-cast');
    const movieGenre = document.getElementById('movie-genre');
    const movieTagline = document.getElementById('movie-tagline');
    const playButton = document.getElementById('play-button');

    movieName.textContent = movie.original_title;
    userRating.innerHTML = generateStars(movie.vote_average) + ` ${parseFloat(movie.vote_average).toFixed(1)} IMDB`;
    contentRating.textContent = movie.adult ? "18+":"16+";
    movieDuration.textContent = calculateDuration(movie.runtime);
    movieDescription.textContent = movie.overview;

    movieGenre.innerHTML = `<span>Genre: </span> `;
    for(let i=0; i<movie.genres.length; i++){
        i == movie.genres.length-1 ? movieGenre.innerHTML += `${movie.genres[i].name}` : movieGenre.innerHTML += `${movie.genres[i].name}, `;
    }
    
    movieCast.innerHTML = `<span>Starring: </span> `+ await getMovieCast(movie.id);
    movieTagline.innerHTML = `<span>Tagline: </span> ${movie.tagline}`;
}

async function displayHeroVideo(movie_id) {
    try {
        const response = await fetch(`${API_URL}/movie/${movie_id}/videos?language=en-US`, options);
        const data = await response.json();
        const trailer = data.results.find(video => video.type === 'Trailer');
        if (trailer) {
            const iframeHTML = `
        <iframe width="100%" height="100%" 
                src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&controls=0&color=white&rel=0&modestbranding=0&playsinline=1&enablejsapi=1&playlist=${trailer.key}" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
        </iframe>
      `;

            document.getElementById('video-container').innerHTML = iframeHTML;
        }
    } catch (error) {
        console.log(error);
    }
}

async function getMovieCast(movie_id) {
    try {
        const response = await fetch(`${API_URL}/movie/${movie_id}/credits?language=en-US`, options);
        const data = await response.json();
        return `${data.cast[0].original_name}, ${data.cast[1].original_name}, ${data.cast[2].original_name}`;
    } catch (error) {
        console.log(error);
    }
    
}

function generateStars(rating) {
    const fullStars = Math.floor(rating/2);
    const halfStars = (rating % 1) >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
    }
    if (halfStars) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="fa-regular fa-star"></i>';
    }
    return starsHtml;
}

function calculateDuration(runtime){
    let hours = Math.floor(runtime/60);
    let minutes = runtime%60;
    return hours + " h " + minutes + " min"; 
}

function generateRandomDuration(){
    let randomDuration = Math.floor(Math.random()*60);
    return calculateDuration(90+randomDuration);
}


document.addEventListener('DOMContentLoaded', () => {
    getPopularMovies();
    getRecommendedMovies();
});


