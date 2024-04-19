import cheerio from 'cheerio';
import axios from 'axios';

// The main function that handles the command
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
        "gif",
        "vid"
    ]

    // Split the input text into feature, inputs, and other arguments
    const [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

    // Check if the feature is valid
    if (!lister.includes(feature)) {
        // Return an error message with an example of usage
        return m.reply("*Example:*\n.pornhub search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
    }

    // Process the feature if it's valid
    if (lister.includes(feature)) {
        if (feature == "search") {
            // Call the searchVideo function with the inputs
            if (!inputs) return m.reply("Input query")
            try {
                const res = await searchVideo(inputs)
                // Format and send the search results
                const teks = res.map((item, index) => {
                    return `*[ RESULT ${index + 1} ]*
*Link:* ${item.link}
*Title:* ${item.title}
*Uploader:* ${item.uploader}
*Views:* ${item.views}
*Duration:* ${item.duration}
`
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
            } catch (e) {
                // Send an error message if there's an error
                await m.reply(eror)
            }
        }
        if (feature == "gif") {
            // Call the searchGif function with the inputs
            if (!inputs) return m.reply("Input query")
            try {
                const res = await searchGif(inputs)
                // Format and send the search results
                const teks = res.map((item, index) => {
                    return `*[ RESULT ${index + 1} ]*
*Title:* ${item.title}
*Url:* ${item.url}
*Webm:* ${item.webm}
`
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
            } catch (e) {
                // Send an error message if there's an error
                await m.reply(eror)
            }
        }
        if (feature == "vid") {
            // Call the getVideo function with the inputs
            if (!inputs) return m.reply("Input query")
            try {
                const res = await getVideo(inputs)
                // Format and send the search results
                const teks = res.mediaDefinitions.map((item, index) => {
                    return `*[ RESULT ${index + 1} ]*
*format:* ${item.format}
*quality:* ${item.quality}
*videoUrl:* ${item.videoUrl}
`
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
            } catch (e) {
                // Send an error message if there's an error
                await m.reply(eror)
            }
        }
    }
}

// Add command information
handler.help = ["pornhub"]
handler.tags = ["internet"]
handler.command = /^(pornhub)$/i

// Export the handler
export default handler

/* New Line */

// Function to search for videos on Pornhub
async function searchVideo(query) {
    const url = `https://www.pornhub.com/video/search?search=${query}`;

    try {
        // Fetch the HTML content of the search results page
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract video information from the HTML content
        return $('li[data-video-segment]').map((i, el) => {
            const $el = $(el);

            return {
                link: "https://www.pornhub.com" + $el.find('.title a').attr('href').trim(),
                title: $el.find('.title a').text().trim(),
                uploader: $el.find('.videoUploaderBlock a').text().trim(),
                views: $el.find('.views').text().trim(),
                duration: $el.find('.duration').text().trim(),
            };
        }).get();
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}

// Function to get video details from a Pornhub video page
async function getVideo(url) {
    try {
        // Fetch the HTML content of the video page
        const response = await axios.get(url);
        const html = response.data;

        // Extract video metadata from the HTML content
        const getSubstring = (startPattern, endPattern) => {
            const startIndex = html.search(startPattern);
            return html.substring(startIndex, html.indexOf(endPattern, startIndex));
        };
        const metaPayload = getSubstring(/var flashvars_\d{1,} = /, ';\n');
        return JSON.parse(metaPayload.substring(metaPayload.indexOf('{')));
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return null;
    }
}

// Function to search for GIFs on Pornhub
async function searchGif(query) {
    const url = `http://www.pornhub.com/gifs/search?search=${query}`;
    const response = await fetch(url);
    const html = await response.text
