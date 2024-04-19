import cheerio from 'cheerio';
import fetch from 'node-fetch';

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
        "detail"
    ]

    // Split the input text into feature, inputs, and other arguments
    const [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

    // Check if the feature is valid
    if (!lister.includes(feature)) {
        // Return an error message with an example usage
        return m.reply("*Example:*\n.caraqu search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
    }

    // Process the feature if it's valid
    if (lister.includes(feature)) {
        if (feature == "search") {
            // Check if inputs are provided for the search feature
            if (!inputs) {
                // Return an error message if inputs are not provided
                return m.reply("Input query link\nExample: .caraqu search|vpn")
            }
            // Send a waiting message
            await m.reply(wait)
            try {
                // Call the searchCaraqu function with the inputs
                const res = await searchCaraqu(inputs)
                // Process the search results and send them as a message
                const teks = res.map((item, index) => {
                    return `🔍 *[ RESULT ${index + 1} ]*

📚 title: ${item.title}
🔗 link: ${item.link}
🖼️ image: ${item.image}
📅 date: ${item.date}
📖 story: ${item.story}
  `
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
            } catch (e) {
                // Send an error message if there's an error in the searchCaraqu function
                await m.reply(eror)
            }
        }

        if (feature == "detail") {
            // Check if inputs are provided for the detail feature
            if (!inputs) {
                // Return an error message if inputs are not provided
                return m.reply("Input query link\nExample: .caraqu search|group")
            }
            // Send a waiting message
            await m.reply(wait)
            try {
                // Call the detailCaraqu function with the inputs
                const item = await detailCaraqu(inputs)
                // Process the detail result and send it as a message with an image
                const cap = `🔍 *[ RESULT ]*

📚 Title: ${item.title}
📝 Content: ${item.content}
🖼️ Image: ${item.image}
`
                await conn.sendFile(m.chat, item.image || logo, "", cap, m)

            } catch (e) {
                // Send an error message if there's an error in the detailCaraqu function
                await m.reply(eror)
            }
        }
    }
}

// Add metadata for the handler function
handler.help = ["caraqu"]
handler.tags = ["internet"]
handler.command = /^(caraqu)$/i

// Export the handler function
export default handler

// Function to search for articles on caraqu.com
async function searchCaraqu(query) {
    const url = `https://www.caraqu.com/?s=${encodeURIComponent(query)}`;

    try {
        // Fetch the webpage content
        const response = await fetch(url);
        const body = await response.text();

        // Parse the webpage content with cheerio
        const $ = cheerio.load(body);

        // Extract the desired information from the parsed content
        return $('.mvp-blog-story-wrap').map((index, element) => ({
            title: $(element).find('.mvp-blog-story-in h2').text().trim(),
            link: $(element).find('a').attr('href'),
            image: $(element).find('.mvp-blog-story-img .mvp-big-img').attr('src'),
            date: $(element).find('.mvp-cat-date-wrap .mvp-cd-date').text().trim(),
            story: $(element).find('.mvp-blog-story-text p').text().trim(),
        })).get();
    } catch (error) {
        // Log the error and return an empty array
        console.log('Error:', error);
        return [];
    }
};

// Function to get the details of an article on caraqu.com
async function detailCaraqu(url) {
    try {
        // Fetch the webpage content
        const response = await fetch(url);
        const body = await response.text();

        // Parse the webpage content with cheerio
        const $ = cheerio.load(body);

        // Extract the desired information from the parsed content
        const title = $('h1.entry-title').text().trim();
        const image = $('div#mvp-post-feat-img img').attr('src');

        const content = $('div#mvp-content-body')
            .find('p, ul > li')
            .map((index, element) => {
                const paragraph = $(element).clone().children().remove().end().text().trim();
                const link = $(element).find('a').attr('href');
                return link ? `${paragraph}\n${link}` : paragraph;
            })
            .get()
            .join('\n');

        const related = $('ul.related-posts-list li')
            .map((index, element) => ({
                title: $(element).find('.mvp-blog-story-in h2').
