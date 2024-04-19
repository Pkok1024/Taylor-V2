// Import the 'node-fetch' module for making HTTP requests
import fetch from 'node-fetch';

// Define the async handler function for the waifuim command
const handler = async (m, { args, conn, usedPrefix, command }) => {
    // Regular expression pattern for matching waifu-related tags
    const rgex = /(maid|waifu|marin-kitagawa|mori-calliope|raiden-shogun|oppai|selfies|uniform|ass|hentai|milf|oral|paizuri|ecchi|ero)/i;
    
    // Extract the waifu tag from the user input
    let waifu;
    if (rgex.test(args[0])) waifu = args[0].match(rgex)[0];
    else waifu = 'waifu'; // Set a default value if no tag is provided

    // Fetch waifu images from the API based on the provided tag
    const response = await fetch(global.API('https://api.waifu.im', '/search', {
        included_tags: waifu // Pass the waifu tag as a query parameter
    }));

    // Parse the JSON response
    const data = await response.json();

    // Check if any images were returned
    if (!data.images[0].url) throw data;

    // Send the first image from the response to the user
    conn.sendFile(m.chat, data.images[0].url, data.images[0].signature + data.images[0].extension, data.images[0].source, m);
}

// Add command metadata
handler.help = ['waifuim'];
handler.tags = ['internet'];
handler.command = ['waifuim'];

// Export the handler function
export default handler;
