const API_URL = 'https://api.themoviedb.org/3/movie/now_playing?api_key=732226ccd502e9fe6b05962474129645'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=732226ccd502e9fe6b05962474129645&query="'
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'api_key=732226ccd502e9fe6b05962474129645';

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')


// genres area
const tagEl = document.getElementById("tag");

const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]
/*const prev=document.getElementById(pre)
const next=document.getElementById(next)
const current=document.getElementById(current)
var currentpage=1;
var nextpage=2;
var prevPage=3;
var lasturl='';
var totalPages=100;*/
var selectedGenre = [];
setGenre();
function setGenre() {
    tagEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;

        t.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id);
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id == genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })

        tagEl.append(t);
    })
}


function highlightSelection() {

    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }

}
// genres area



getMovies(API_URL);
function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        showMovies(data.results);
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
        <div id="${id}">
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
        </div>
        `
        main.appendChild(movieEl)

        document.getElementById(id).addEventListener('click', () => {
            console.log(id);
            openNav(movie);
        })
    })
}


// get movie details area 

const detailsofmovie = document.getElementById("movie_details")

function openNav(movie) {
    detailsofmovie.innerHTML = '';
    let id = movie.id;
    fetch(BASE_URL + '/movie/' + id + '?' + API_KEY)
        .then(res => res.json())
        .then(({ title, overview, poster_path, original_language, vote_average, runtime, genres }) => {

            let genreName = [];
            for (let i = 0; i < genres.length; i++) {
                genreName.push(genres[i].name);
            }
            const movieDetails = document.createElement('div');
            
            let price = Math.floor(Math.random() * (300 - 250 + 1) + 250);
            
            movieDetails.classList.add('overlay-content');
            movieDetails.innerHTML = ` 
            
                <div class="description_image">
                    <img src="${IMG_PATH + poster_path}">
                </div>
                <div class="movie-details">
                    <h3>${title}</h3>
                    <h5>${vote_average}/10</h5>
                    <h5>${original_language}</h5>
                    <h5>${runtime} min</h5>
                    <h5>${genreName} </h5>
                    <h5>${overview}</h5>
                
                
                <div id="ticket-container">
                    <p id="ticket-price"><span id="price">₹ &nbsp${price}</span></p>
                    <button id="buy-button">Buy Ticket</button>
                </div>
                </div> 
             
                `  
            detailsofmovie.appendChild(movieDetails);
            
            document.getElementById("buy-button").addEventListener("click", function() {
                window.location.href=`checkout.html?price=${price}&title=${title}`;
              });
        })


        
    document.getElementById("myNav").style.height = "100%";
}



function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

// get movie details area 

function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    }
    else if (vote >= 5) {
        return 'orange'
    }
    else {
        return 'red';
    }
}





// ********************* Search Part **********************
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)

        search.value = ''
    }
    else if (searchTerm == '') {
        getMovies(API_URL)
    }
})
// ********************* Search Part **********************

// open the genre part


function openGenre() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeGenre() {
    document.getElementById("mySidenav").style.width = "0";
}





// open the genre part