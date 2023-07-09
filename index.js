const axios = require('axios');
const cheerio = require('cheerio');


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
        return data;
    } catch (error) {
        console.error(error);
      }
};


// getData(netflix.url).then(res => {
//     console.log(res)
// })