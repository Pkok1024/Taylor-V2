import cheerio from 'cheerio';
import axios from 'axios';

class WABetaInfo {
    // The WABetaInfo class is used to scrape data from the WABetaInfo website.

    async home() {
        // The home method is used to scrape the home page of the WABetaInfo website.
        try {
            const {
                data
            } = await axios.get('https://wabetainfo.com');
            // The axios.get method is used to send a GET request to the WABetaInfo home page.
            const $ = cheerio.load(data);
            // The cheerio.load method is used to load the HTML data and create a Cheerio instance.
            return $('article[id^="post-"]').map((_, el) => ({
                // The map method is used to iterate over each article element and extract the required data.
                title: $('.entry-title a', el).text().trim(),
                // The text method is used to extract the text content of the title element.
                date: new Date($('.published.updated', el).attr('datetime')).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                // The attr method is used to extract the datetime attribute value of the published element.
                category: $('.entry-categories a', el).map((_, cat) => $(cat).text().trim().toUpperCase()).get(),
                // The map method is used to extract the text content of each category element.
                excerpt: $('.entry-excerpt', el).text().trim(),
                // The text method is used to extract the text content of the excerpt element.
                readMoreLink: $('.entry-read-more', el).attr('href'),
                // The attr method is used to extract the href attribute value of the read-more link.
            })).get().filter(article => Object.values(article).every(value => value !== undefined && value !== ''));
            // The filter method is used to remove any articles with missing or empty values.
        } catch (error) {
            console.error('Error fetching home page:', error);
            return [];
            // If there is an error while fetching the home page, an empty array is returned.
        }
    }

    async read(url) {
        // The read method is used to scrape a specific article from the WABetaInfo website.
        try {
            const {
                data
            } = await axios.get(url);
            // The axios.get method is used to send a GET request to the specified article URL.
            const $ = cheerio.load(data);
            $('.quads-location, .sharedaddy, .channel_card, style').remove();
            // The remove method is used to remove unnecessary elements from the Cheerio instance.
            return $('article[id^="post-"]').map((_, el) => ({
                category: $(el).attr('class').match(/category-(\w+)/i)?.[1]?.toUpperCase() || '',
                // The attr method is used to extract the class attribute value of the article element.
                // The match method is used to extract the category name from the class attribute value.
                date: new Date($('.entry-date time', el).attr('datetime')).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                // The attr method is used to extract the datetime attribute value of the entry-date time element.
                article: $('.kenta-article-content', el).clone().find('.wpra-reactions-container, table').remove().end().text().trim().replace(/\n+/g, '\n'),
                // The clone method is used to create a copy of the kenta-article-content element.
                // The find method is used to remove unnecessary elements from the copy.
                // The text method is used to extract the text content of the copy.
                reactions: $('.wpra-reactions-container .wpra-reaction', el).map((_, el) => ({
                    // The map method is used to extract the name and count of each reaction.
                    name: ['Thumbs Up', 'Heart', 'Laughing', 'Surprised', 'Angry', 'Sad'][$(el).index()],
                    count: parseInt($(el).attr('data-count'), 10)
                })).get(),
                questions: $('.kenta-article-content table tbody tr', el).map((_, el) => ({
                    // The map method is used to extract the question and answer from each table row.
                    question: $('td:first-child', el).text().trim(),
                    answer: $('td:last-child', el).text().trim()
                })).get(),
                image: $('.image-container img', el).map((_, img) => $(img).attr('src')).get(),
                // The map method is used to extract the src attribute value of each image.
                recents: $('#recent-posts-2 ul li a', el).map((_, el) => ({
                    // The map method is used to extract the title and link of each recent post.
                    title: $(el).text().trim(),
                    link: $(el).attr('href')
                })).get(),
            })).get();
        } catch (error) {
            console.error('Error fetching article:', error);
            return [];
            // If there is an error while fetching the article, an empty array is returned.
        }
    }

    async search(q) {
        // The search method is used to search for articles on the WABetaInfo website.
        try {
            const {
                data
            } = await axios.get(`https://wabetainfo.com/?s=${encodeURIComponent(q)}`);
            // The axios.get method is used to send a GET request to the search results page.
            const $ = cheerio.load(data);
            return $('article[id^="post-"]
