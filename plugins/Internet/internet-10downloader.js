import cheerio from 'cheerio';
import fetch from 'node-fetch';

// The main handler function for the 10down command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {

    // List of available features
    const lister = [
        "link",
        "mp4",
        "mp3",
        "search"

    ]

    // Split the input text into feature, inputs, and other arguments
    const [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

    // Check if the feature is valid
    if (!lister.includes(feature)) {
        // If not, reply with usage example
        return m.reply("*Example:*\n.10down search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
    }

    // Handle the feature based on its name
    if (lister.includes(feature)) {
        if (feature == "link") {
            // Handle the link feature
        }

        if (feature == "search") {
            // Handle the search feature
        }

        if (feature == "mp3") {
            // Handle the mp3 feature
        }

        if (feature == "mp4") {
            // Handle the mp4 feature
        }
    }
}

handler.help = ["10down"]
handler.tags = ["internet"]
handler.command = /^(10down)$/i
export default handler

/* New Line */

// Function to fetch video information from 10downloader.com
async function YoutubePlaylist(query) {
    // Construct the URL for the API request
    const url = 'https://10downloader.com/download?v=' + query;

    // Send a GET request to the URL
    const response = await fetch(url);

    // Parse the HTML response
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract video and thumbnail information from the HTML
    const video = [];
    const thumbnail = [];

    // Select the video downloads table and iterate through its rows
    $('#video-downloads .downloadsTable tbody tr').each((index, element) => {
        // Extract quality, format, size, and link information
        const [quality, format, size] = $(element).find('td').slice(0, 3).map((i, el) => $(el).text().trim()).get();
        const link = $(element).find('td:nth-child(4) a').attr('href');

        // Add the extracted information to the video array
        video.push({
            quality,
            format,
            size,
            link,
            thumb
        });
    });

    // Select the thumbnail downloads table and iterate through its rows
    $('#thumbnail-downloads .downloadsTable tbody tr').each((index, element) => {
        // Extract quality, format, size, and thumbnail information
        const [quality, format, size] = $(element).find('td').slice(0, 3).map((i, el) => $(el).text().trim()).get();
        const thumb = $('tbody tr:first-child a').attr('href');

        // Add the extracted information to the thumbnail array
        thumbnail.push({
            quality,
            format,
            size,
            thumb
        });
    });

    // Extract the title and duration information from the HTML
    const title = $('.title').text().trim();
    const duration = $('.duration span').text().trim();

    // Return an object containing the extracted information
    return {
        title,
        duration,
        thumbnail,
        video
    };
};

// Function to shorten a URL using the tinyurl.com API
async function shortUrl(url) {
    // Send a GET request to the tinyurl.com API
    let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)

    // Return the shortened URL as a string
    return await res.text()
}

// Function to fetch music information from x2convert.com
async function getMusic(url) {
    // Send a GET request to the x2convert.com API
    try {
        var check = await fetch("https://x2convert.com/ajax2/getFile.ashx?linkinfo=" + url + "&lang=id&option=100&country=ID");

        // Return the parsed JSON response
        return await check.json();
    } catch (error) {
        console.error(error);
        return "not-valid";
    }
}

// Function to fetch video information from videovor.com
async function getVideo(q) {
    // Construct the URL for the API request
    const url = 'https://www.videovor.com/en/getlinks?url=' + q + '&r=0&retry=false';

    // Send a GET request to the URL
    try {
        const response = await fetch(url);

        // Parse the JSON response
        const data = await response.text();

        // Return the parsed JSON data
        return JSON.parse(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to search for videos on mp3download.to
async function getSearch(teks) {
    // Replace spaces in the search query with plus signs
    teks = teks.replace(" ", "+");

    // Send a GET request to the mp3download.to API
    try {
        // Parse the JSON response
        var api = await fetch("https://api.mp3download.to/v1/external/search/?query=" + teks);
        api = await api.json();

        // Extract the relevant information from the API response
        return api["data"]["items"].map(item => {
            return {
                "title": item["title"],
                "id": item["id"],
                "link": "
