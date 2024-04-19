import fetch from 'node-fetch' // Importing the 'node-fetch' module to make HTTP requests

let timeout = 120000 // Timeout duration for the game in milliseconds
let poin = 4999 // Bonus XP points for the game

// The main handler function for the 'tebakbendera' game command
const handler = async (m, { conn, command, usedPrefix }) => {
    // Check if the chat ID is already in the game object
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    if (id in conn.tebakbendera) {
        // If it is, send a message saying there's an ongoing game
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbendera[id][0])
        throw false
    }
    let json

    try {
        // Fetch the list of country codes and flags from the FlagCDN API
        let data = await (await fetch('https://flagcdn.com/en/codes.json')).json();
        // Select a random country code and flag from the list
        const randomKey = Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)];
        json = {
            "name": data[randomKey], // The name of the country
            "img": `https://flagpedia.net/data/flags/ultra/${randomKey}.png` // The URL of the flag image
        };
    } catch (e) {
        try {
            // If the FlagCDN API fails, fetch the list of country codes and flags from the BochilTeam GitHub repository
            let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera2.json')).json()
            json = src[Math.floor(Math.random() * src.length)] // Select a random country code and flag from the list
        } catch (e) {
            // If both APIs fail, throw an error and end the function
            throw false
        }
    }

    // Create the caption for the game message
    let caption = `*${command.toUpperCase()}*
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hben untuk bantuan
Bonus: ${poin} XP
    `.trim()

    // Log the name of the country for debugging purposes
    conn.logger.info(json.name)

    // Add the game data to the game object for the chat ID
    conn.tebakbendera[id] = [
        // The message object for the flag image
        await conn.send
