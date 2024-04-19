import cheerio from 'cheerio';
import fetch from 'node-fetch';

// The main function that handles the command execution
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    // Reply to the user with a loading message
    await m.reply(wait);
    try {
        // Fetch a random fact and wait for the response
        let item = await getRandomFact();
        // Prepare the response message
        let cap = `🔍 *[ RESULT ]*

📚 Title: ${item.title}
🔗 Link: ${item.source}
📖 Description: ${item.description}
`;
        // Send the response message with the fetched fact image
        await conn.sendFile(m.chat, item.image || logo, "", cap, m);
    } catch (e) {
        // If there's an error, reply with an error message
        await m.reply(eror);
    }
}

// Add the command's help, tags, and prefix information
handler.help = ["factrepublic"];
handler.tags = ["internet"];
handler.command = /^(factrepublic)$/i;

// Export the handler function to be used as a command
export default handler;

/* New Line */

// An asynchronous function to fetch a random fact from factrepublic.com
const getRandomFact = async () => {
    try {
        // Prepare the URL for fetching the random fact page
        const url = 'https://factrepublic.com/random-facts-generator/';
        // Fetch the page content
        const response = await fetch(url);
        // If the fetch fails, throw an error
        if (!response.ok) throw new Error('Failed to fetch the page');
        // Convert the response to text
        const html = await response.text();
        // Load the HTML content using Cheerio
        const $ = cheerio.load(html);
        // Generate a random index within the range of fact elements
        const randomIndex = Math.floor(Math.random() * $('.td-item').length);
        // Select the random fact element
        const randomFactElement = $('.td-item').eq(randomIndex);
        // Return the fact details
        return {
            title: randomFactElement.find('.td-sml-current-item-title').text(),
            description: randomFactElement.find('.
