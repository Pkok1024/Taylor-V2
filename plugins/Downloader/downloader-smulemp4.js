import fetch from 'node-fetch' // Importing the 'node-fetch' module to make HTTP requests

let handler = async (m, { // Defining the 'handler' function with 'm' as the message object and 'params' as the parameter object
    conn, // The 'conn' variable represents the WhatsApp connection object
    text, // The 'text' variable contains the message content
    usedPrefix, // The 'usedPrefix' variable contains the prefix used in the command
    command // The 'command' variable contains the command name
}) => {
    if (!text) throw `*Usage : ${usedPrefix + command} smule_url_media*\n\nExample :\n${usedPrefix + command} https://www.smule.com/recording/lewis-capaldi-someone-you-loved/2027750707_2937753991` // Throwing an error message if 'text' is not provided
    if (!(text.includes('http://') || text.includes('https://'))) throw `url invalid, please input a valid url. Try with add http:// or https://` // Throwing an error message if the URL is invalid
    try {
        let anu = await fetch(`https://api.lolhuman.xyz/api/smule?apikey=${global.lolkey}&url=${text}`) // Making an HTTP request to the Smule API using the 'fetch' module
        let json = await anu.json() // Parsing the response as JSON
        await conn.sendMessage(m.chat, { // Sending a message to the chat using the 'conn' object
            video: {
                url: json.result.video // Setting the video URL to the 'video' property of the message object
            },
            caption: json.result.title // Setting the caption to the 'caption' property of the message object
        }, {
            quoted: m // Quoting the original message
        })
    } catch (e) {
        console.log(e) // Logging the error to the console
        m.reply(`Invalid Smule url.`) // Replying with an error
