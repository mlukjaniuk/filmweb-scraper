const axios = require('axios');
const jsdom = require("jsdom")

const url = 'https://www.filmweb.pl/ranking/vod';

const netflix = {
    name: 'Netflix',
    url: '/netflix/film',
    movies: []
};

const hbo = {
    name: 'HBO Max',
    url: '/hbo_max/film',
    movies: []
};

const canal_plus = {
    name: 'Canal+',
    url: '/canal_plus_manual/film',
    movies: []
};

const disney_plus = {
    name: 'Disney+',
    url: '/disney/film',
    movies: []
};

async function getData(vod_url) {
    try {
        const data = await axios.get(url + vod_url + '/2023');
        return data.data;
    } catch (error) {
        console.error(error);
      }
};

function getTitles(document) {
    const dom = new jsdom.JSDOM(document);
    document = dom.window.document;
    const moviesTags = document.querySelectorAll('a[href^="/film/"]');
    const moviesArray = Array.from(moviesTags);
    const moviesTitles = moviesArray.map(movie => movie.textContent).filter(movie => movie !== '');
    return moviesTitles.splice(0, 10);
}

function getRatings(document) {
    const dom = new jsdom.JSDOM(document);
    document = dom.window.document;
    const ratingsTags = document.querySelectorAll('span[class="rankingType__rate--value"]');
    const ratingsArray = Array.from(ratingsTags);
    const ratings = ratingsArray.map(rating => rating.textContent)
    return ratings.splice(0, 10);
}

async function addMovies(vod) {
    await getData(vod.url).then(res => {
        titles = getTitles(res);
        ratings = getRatings(res);
        titles.forEach((title, index) => vod.movies.push({title: title, rating: ratings[index]}));
    })
}

    

// getData(netflix.url).then(res => {
//     addMovies(netflix).then(() => {
//         addMovies(hbo).then(() => {
//             addMovies(canal_plus).then(() => {
//                 addMovies(disney_plus).then(() => {
//                     console.log(netflix);
//                     console.log(hbo);
//                     console.log(canal_plus);
//                     console.log(disney_plus);
//                 })
//             })
//         })
//     })
// })
