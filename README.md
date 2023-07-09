### NodeJS Assignment

Create a simple web scraper that will download titles and ratings of movies from filmweb.pl
(https://www.filmweb.pl/ranking/vod/film). Scraped movies should be from actual year and
you should include only top 4 VOD services (Netflix, Max, Canal +, Disney). From each VOD
movies list, you should scrape only 10 top movies. Then you should deduplicate (if needed)
by movie title (higher range should be saved). Results should be saved in CSV file format
with such columns: Title, VOD service name, rating. Results should be ordered by rating in
descending order.