import { fetch as undiciFetch } from 'undici';
import cheerio from 'cheerio';

type SearchResult = {
  title: string;
  link: string;
  image: string;
  categories: string[];
  year: string;
  episodes: string;
};

type DownloadInfo = {
  episode: string;
  episodeInfo: Record<string, { platform: string; link: string }[]>;
};

type DrakorData = {
  title: string;
  synopsis: string;
  rating: string;
  genres: string[];
  downloadInfo: DownloadInfo[];
};

const BASE_URL = 'https://drakorasia.us';
const SEARCH_URL = `${BASE_URL}/?s=:query&post_type=post`;
const DETAIL_URL = `${BASE_URL}:id`;

async function fetchWithErrorHandling(url: string): Promise<string> {
  try {
    const response = await undiciFetch(url);

    if (!response.ok) {
      throw new Error(`Non-200 status code: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}

function parseSearchResults($: cheerio.Root): SearchResult[] {
  return $('#post.archive')
    .map((_, element) => {
      const title = $(element).find('h2 a').text().trim();
      const link = $(element).find('h2 a').attr('href')!;
      const image = $(element).find('img').attr('src')!;
      const categories = $(element)
        .find('.genrenya span[rel="tag"]')
        .map((_, el) => $(el).text().trim())
        .get();
      const year = $(element).find('.category a[rel="tag"]').text();
      const episodes = $(element)
        .find('.category')
        .contents()
        .filter((_, el) => el.nodeType === 3)
        .text()
        .trim();

      return { title, link, image, categories, year, episodes };
    })
    .get();
}

function parseDrakorData($: cheerio.Root): DrakorData {
  const title = $('h2 span.border-b-4').text().trim();
  const synopsis = $('#synopsis p.caps strong').text().trim();
  const rating = $('.wpd-rating-value .wpdrv').text();
  const genres = $('.genrenya span[rel="tag"]')
    .map((_, el) => $(el).text().trim())
    .get();

  const downloadInfo: DownloadInfo[] = $('#content-post table.mdl-data-table tbody tr')
    .map((_, el) => {
      const episode = $(el).find('td:first-child').text().trim();
      const episodeInfo: Record<string, { platform: string; link: string }[]> = {};

      $('thead th')
        .filter((_, el) => $(el).text().includes('Download'))
        .map((_, el) => {
          const resolution = $(el).text().trim().replace('Download ', '').toLowerCase();
          const columnIndex = $('thead th:contains("Download ' + resolution + '")').index();
          const resolutionColumn = $(el).find('td:eq(' + columnIndex + ')');

          resolutionColumn.find('a').each((_, a) => {
            const link = $(a).attr('href');
            const platform = $(a).text().trim();

            if (!episodeInfo[resolution]) {
              episodeInfo[resolution] = [];
            }

            episodeInfo[resolution].push({ platform, link });
          });
        })
        .get();

      return { episode, episodeInfo };
    })
    .get();

  return { title, synopsis, rating, genres, downloadInfo };
}

export async function searchDrakor(query: string): Promise<SearchResult[]> {
  const url = SEARCH_URL.replace(':query', query);
  const html = await fetchWithErrorHandling(url);
  const $ = cheerio.load(html);

  return parseSearchResults($);
}

export async function downloadDrakor(id: string): Promise<DrakorData> {
  const url = DETAIL_URL.replace(':id', id);
  const html = await fetchWithErrorHandling(url);
  const $ = cheerio.load(html);

  return parseDrakorData($);
}
