import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

/**
 * This function is used to scrape the likee video details from likeedownloader.com.
 * It takes a single argument `url` which is the URL of the likee video.
 *
 * @param {string} url - The URL of the likee video.
 * @returns {Object} An object containing the scraped data.
 */
export default async (url) => {
    try {
        // Create a new instance of FormData to send a POST request
        const form = new FormData();
        form.append('id', url); // Append the video URL to the form data
        form.append('locale', 'en'); // Append the locale as 'en' to the form data

        // Send a POST request to likeedownloader.com/process with the form data
        const json = await (await axios.post('https://likeedownloader.com/process', form)).data;

        // Log the response from the server for debugging purposes
        console.log(json);

        // Load the response into cheerio to parse and manipulate the HTML
        const $ = cheerio.load(json.template);

        // Create an empty array `urls` to store the URLs of the video with and without watermark
        const urls = [];

        // Use cheerio to select all 'a' elements and iterate over them
        $('a').each((i, e) => {
            // Push the href attribute of each 'a' element to the `urls` array
            urls.push($(e).attr('href'));
        });

        // Create a new object `res` to store the URLs of the video with and without watermark
        const res = {
            'watermark': urls[0],
            'no watermark': urls[1],
        };

        // Return an object containing the scraped data
        return {
            creator: 'Wudysoft', // The name of the creator of the function
            status: true, // A boolean indicating whether
