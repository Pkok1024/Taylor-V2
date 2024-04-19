import fetch from "node-fetch";
import cheerio from "cheerio";

// Handler function for the chatopenai command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    // Check if the user has replied to a message or audio
    if (!m.quoted) return m.reply("Reply Teks/Audio untuk menggunakan gpt ini");

    try {
        // If the user has replied with text
        if (m.quoted.text) {
            // Call the gptChat function with the quoted text
            let res = await gptChat(m.quoted.text);
            // Reply to the user with the response from the gptChat function
            await m.reply(res.data);
        } 
        // If the user has replied with audio
        else if (m.quoted.mimetype.includes("audio")) {
            // Download the audio and call the gptAudio function with the audio buffer
            let audioBuff = await m.quoted.download();
            let res = await gptAudio(audioBuff);
            // Reply to the user with the response from the gptAudio function
            await m.reply(res.data);
        }
    } catch (e) {
        // Log any errors and reply to the user with an error message
        console.error('An error occurred:', e.message);
        await m.reply('Error occurred. Please try again.');
    }
};

// Add command metadata
handler.help = ["chatopenai"];
handler.tags = ["gpt"];
handler.command = /^(chatopenai)$/i;

// Export the handler function
export default handler;

/* New Line */

// Function to handle audio input
const gptAudio = async (audioBuffer) => {
    try {
        // Call the getInfo function to get information about the chat
        const info = await getInfo();
        // Create a new FormData object
        const data = new FormData();
        // Create a new Blob object from the audio buffer
        const blob = new Blob([audioBuffer.toArrayBuffer()], {
            type: 'audio/mpeg'
        });
        // Append the necessary data to the FormData object
        data.append('_wpnonce', info[0]['data-nonce']);
        data.append('post_id', info[0]['data-post-id']);
        data.append('action', 'wpaicg_chatbox_message');
        data.append('audio', blob, 'wpaicg-chat-recording.wav');
        // Send a POST request to the chat server with the FormData object
        const response = await fetch('https://chatopenai.me/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: data
        });

        // If the response was not ok, throw an error
        if (!response.ok) throw new Error('Network response was not ok');

        // Return the response as JSON
        return await response.json();
    } catch (error) {
        // Log any errors and throw the error
        console.error('An error occurred:', error.message);
        throw error;
    }
}

// Function to handle text input
const gptChat = async (message) => {
    try {
        // Call the getInfo function to get information about the chat
        const info = await getInfo();
        // Create a new FormData object
        const data = new FormData();
        // Append the necessary data to the FormData object
        data.append('_wpnonce', info[0]['data-nonce']);
        data.append('post_id', info[0]['data-post-id']);
        data.append('action', 'wpaicg_chatbox_message');
        data.append('message', message);
        // Send a POST request to the chat server with the FormData object
        const response = await fetch('https://chatopenai.me/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: data
        });

        // If the response was not ok, throw an error
        if (!response.ok) throw new Error('Network response was not ok');

        // Return the response as JSON
        return await response.json();
    } catch (error) {
        // Log any errors and throw the error
        console.error('An error occurred:', error.message);
        throw error;
    }
}

// Function to get information about the chat
const getInfo = async () => {
    const url = 'https://chatopenai.me';

    try {
        // Send a GET request to the chat server and parse the HTML response
       
