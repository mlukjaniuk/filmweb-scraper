const fs = require('fs');
const {
  getData,
  getTitles,
  getRatings,
  addMovies,
  exportToCsv,
  sortMovies
} = require('./webScraper');

test('getData() should return data from the website', async () => {
  const vod_url = '/netflix/film';
  const response = await getData(vod_url);
  expect(response).toBeDefined();
});

test('getTitles() should return an array of 10 titles', () => {
  const document = fs.readFileSync('./testData.html', 'utf8');
  const titles = getTitles(document);
  expect(titles.length).toBe(10);
});

test('getRatings() should return an array of 10 ratings', () => {
  const document = fs.readFileSync('./testData.html', 'utf8');
  const ratings = getRatings(document);
  expect(ratings.length).toBe(10);
});

test('addMovies() should add 10 movies to the vod object', async () => {
  const vod = {
    name: 'Netflix',
    url: '/netflix/film',
    movies: []
  };
  await addMovies(vod);
  expect(vod.movies.length).toBe(10);
});

test('exportToCsv() should create a csv file', async () => {
  const vod = {
    name: 'Netflix',
    url: '/netflix/film',
    movies: [{
      title: 'Nimona',
      vod: 'Netflix',
      rating: '7,37'
    },
    {
      title: 'Fenomen',
      vod: 'Netflix',
      rating: '7,29'
    },
    {
      title: 'Zaopiekujcie się Mayą',
      vod: 'Netflix',
      rating: '7,08'
    },
    {
      title: 'Bill Russell: Legenda NBA',
      vod: 'Netflix',
      rating: '7,04'
    },
    {
      title: 'Wham!',
      vod: 'Netflix',
      rating: '6,99'
    },
    {
      title: 'Jesteśmy idealni',
      vod: 'Netflix',
      rating: '6,77'
    }]
  };
  exportToCsv(vod.movies);
  expect(fs.existsSync(`scraped_movies.csv`)).toBe(true);
});

test('sortMovies() should sort movies by rating', () => {
  const vod = {
    name: 'Netflix',
    url: '/netflix/film',
    movies: [
      {
        title: 'Nimona',
        vod: 'Netflix',
        rating: '7,37'
      },
      {
        title: 'Fenomen',
        vod: 'Netflix',
        rating: '7,29'
      },
      {
        title: 'Zaopiekujcie się Mayą',
        vod: 'Netflix',
        rating: '7,08'
      },
      {
        title: 'Bill Russell: Legenda NBA',
        vod: 'Netflix',
        rating: '7,04'
      },
      {
        title: 'Wham!',
        vod: 'Netflix',
        rating: '6,99'
      },
      {
        title: 'Jesteśmy idealni',
        vod: 'Netflix',
        rating: '6,77'
      }
    ]
  };

  const sortedMovies = sortMovies(vod.movies);

  expect(sortedMovies).toEqual([
    { rating: '7,37', title: 'Nimona', vod: 'Netflix' },
    { rating: '7,29', title: 'Fenomen', vod: 'Netflix' },
    { rating: '7,08', title: 'Zaopiekujcie się Mayą', vod: 'Netflix' },
    { rating: '7,04', title: 'Bill Russell: Legenda NBA', vod: 'Netflix' },
    { rating: '6,99', title: 'Wham!', vod: 'Netflix' },
    { rating: '6,77', title: 'Jesteśmy idealni', vod: 'Netflix' }
  ]);
  expect(sortedMovies[0].rating).toBe('7,37');
  expect(sortedMovies[sortedMovies.length - 1].rating).toBe('6,77');
});
