import cheerio from 'cheerio';
import fetch from 'node-fetch';

// The main handler function for the rexdl command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {

    // List of available features
    const lister = [
        "search",
        "app"
    ]

    // Split the input text into feature, inputs, and other arguments
    const [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

    // Check if the feature is valid
    if (!lister.includes(feature)) {
        // Return an error message with an example usage
        return m.reply("*Example:*\n.rexdl search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
    }

    // Handle the feature based on the user's input
    if (lister.includes(feature)) {
        if (feature == "search") {
            // Search feature implementation
        }

        if (feature == "app") {
            // App feature implementation
        }
    }
}
handler.help = ["rexdl"]
handler.tags = ["internet"]
handler.command = /^(rexdl)$/i
export default handler

/* New Line */

// Function to search for articles on rexdl.com
async function searchRexdl(query) {
    const url = `https://rexdl.com/?s=${query}`;

    try {
        // Fetch the HTML content of the search results page
        const response = await fetch(url);
        const html = await response.text();

        // Parse the HTML content using Cheerio
        const $ = cheerio.load(html);

        // Extract the desired information from the parsed HTML
        const articles = [];

        $('article').each((index, element) => {
            const $article = $(element);
            const thumbnailSrc = $article.find('.post-thumbnail img').attr('data-src');
            const categories = $article.find('.post-category a').map((index, el) => $(el).text()).get();
            const date = $article.find('.post-date time').attr('datetime');
            const author = $article.find('.post-byline .author a').text();
            const title = $article.find('.post-title a').text();
            const titleUrl = $article.find('.post-title a').attr('href');
            const excerpt = $article.find('.entry p').text().trim();

            const articleData = {
                thumbnail: thumbnailSrc,
                categories,
                date,
                author,
                title,
                titleUrl,
                excerpt
            };

            articles.push(articleData);
        });

        // Return the extracted information as an array of article objects
        return articles;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to extract app information from a rexdl.com page
async function getRexdl(url) {
    const response = await fetch(url);
    const html = await response.text();

    // Parse the HTML content using Cheerio
    const $ = cheerio.load(html);

    // Extract the desired information from the parsed HTML
    const dlbox = $('#dlbox');
    const headingText = $('.entry-inner').text();
    const headingTitle = $('.entry-inner').text().split(",")[0];
    const downloadLink = $('.readdownload a').attr('href');
    const imageData = dlbox.find('img').attr('data-src');
    const dlList = dlbox.find('.dl-list');
    const version = dlList.find('.dl-version span').text().trim();
    const fileSize = dlList.find('.dl-size span').text().trim();
    const sourceLink = dlList.find('.dl-source a').attr('href');

    const info = {
        imageData,
        headingTitle,
        headingText,
        downloadLink,
        version,
        fileSize,
        sourceLink,
    };

    // Fetch the download page HTML content
    const resdown = await fetch(info.downloadLink);
    const htmldown = await resdown.text();

    // Parse the download page HTML content using Cheerio
    const $down = cheerio.load(htmldown);
    const dlboxdown = $down('#dlbox');

    // Extract the download URLs from the parsed HTML
    const apkUrls = dlboxdown
        .find('a')
        .map((index, element) => $down(element).attr('href'))
        .get()
        .filter(url => url.endsWith('.apk'));

    // Extract the updated and current version information from the parsed HTML
    const updated = dlboxdown.find('li.dl-update span').eq(1).text();
    const currentVersion = dlboxdown.find('li.dl-version span').eq(1).text();
    const fileSizeDownload = dlboxdown.find('li.dl-size span').eq(1).text();
    const password = dlbox.find('li.dl-key span.txt-dl-list').text();

    // Create a download object with the extracted information
    const download = {
        apkUrls,
        updated,
        currentVersion,
        fileSizeDownload,
        password,
    };

    // Return an object containing the extracted info and download objects
    return {
        info,
        download
    };
}
