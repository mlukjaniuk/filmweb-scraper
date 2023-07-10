const axios = require('axios');
const jsdom = require("jsdom");
const { ExportToCsv } = require('export-to-csv');
const fs = require('fs');

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
    const response = await axios.get(url + vod_url + '/2023');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

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
  const ratings = ratingsArray.map(rating => rating.textContent);
  return ratings.splice(0, 10);
}

async function addMovies(vod) {
  try {
    const res = await getData(vod.url);
    const titles = getTitles(res);
    const ratings = getRatings(res);
    titles.forEach((title, index) => vod.movies.push({ title, vod: vod.name, rating: ratings[index] || '0' }));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add movies');
  }
}

function deduplicateMovies(vods) {
  const allMovies = [];
  vods.forEach(vod => {
    vod.movies.forEach(movie => {
      allMovies.push(movie);
    });
  });
  const uniqueMovies = allMovies.reduce((acc, curr) => {
    const x = acc.find(item => item.title === curr.title);
    if (!x) {
      return acc.concat([curr]);
    } else {
      if (x.rating >= curr.rating) {
        return acc;
      } else {
        return acc.filter(item => item.title !== curr.title).concat([curr]);
      }
    }
  }, []);
  return uniqueMovies;
}

function sortMovies(movies) {
  movies.sort((a, b) => {
    if (a.rating > b.rating) {
      return -1;
    }
    if (a.rating < b.rating) {
      return 1;
    }
    return 0;
  });
}

function exportToCsv(movies) {
  try {
    const csvExporter = new ExportToCsv({
      fieldSeparator: ';',
      quoteStrings: '',
      decimalSeparator: ',',
      showLabels: true,
      showTitle: false,
      title: 'Scraped movies',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: ['Title', 'VOD service name', 'Rating']
    });

    const csvData = csvExporter.generateCsv(movies, true);
    console.log(csvData);
    fs.writeFileSync('scraped_movies.csv', csvData);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to export CSV');
  }
}

async function webScraper() {
  try {
    await addMovies(netflix);
    await addMovies(hbo);
    await addMovies(canal_plus);
    await addMovies(disney_plus);
    const vods = [netflix, hbo, canal_plus, disney_plus];
    const uniqueMovies = deduplicateMovies(vods);
    sortMovies(uniqueMovies);
    exportToCsv(uniqueMovies);
  } catch (error) {
    console.error(error);
  }
}

webScraper();
