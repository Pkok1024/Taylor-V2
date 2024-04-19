import fetch from 'node-fetch';

// This is an asynchronous function that is called before a message is processed by the bot.
export async function before(m) {
    // Destructure the 'alicia' object from the 'chats' database for the current chat.
    const { alicia } = global.db.data.chats[m.chat] || {};

    // Return false if the message is sent by the bot or if 'alicia' is not defined or if the message is not a text message.
    if (m.isBaileys || !alicia || !m.text) return false;

    // Remove any non-ASCII characters from the message text and trim any leading or trailing whitespace.
    const text = m.text.replace(/[^\x00-\x7F]/g, '').trim();

    // Return false if the message text is empty.
    if (!text) return false;

    // Define the URL for the Alicia API using the message text, the user's name, and a hard-coded API key.
    const url = `https://api.azz.biz.id/api/alicia?q=${encodeURIComponent(text)}&user=${m.name}&key=global`;

    try {
        // Send a GET request to the Alicia API and parse the response as JSON.
        const api = await fetch(url);
        const res = await api.json();

        // Check if the API response contains a 'respon' property.
        if (res.respon) {
            // Send a reply to the chat with the Alicia response.
            await this.reply(m.chat, `*alicia says:*\n${res.respon || ''}`, m);

            // If the message text is 'ALICIA STOP', set 'alicia' to false and send a success message.
            if (text.trim().toUpperCase() === 'ALICIA STOP') {
                alicia = false;
                await this.reply(m.chat, `*alicia stop success*`, m);
            }

            // Return true to
