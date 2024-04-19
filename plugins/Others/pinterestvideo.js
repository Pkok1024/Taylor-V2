import {
    spin
} from '../../lib/scraper/scrape.js' // Importing the 'spin' function from the scraper library

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {

    // Check if the user provided a URL argument
    if (!args[0]) throw `*Perintah ini untuk mengunduh video dari pinterest dengan link*\n\ncontoh:\n${usedPrefix + command} https://id.pinterest.com/pin/27162403992537372/`

    // Validate the URL argument to ensure it's a Pinterest link
    if (!args[0].match(/https:\/\/.*pinterest.com\/pin|pin.it/gi)) throw `*Link salah! Perintah ini untuk mengunduh video dari pinterest dengan link*\n\ncontoh:\n${usedPrefix + command} https://id.pinterest.com/pin/27162403992537372/`

    // Call the 'spin' function with the provided URL argument
    await spin(args[0]).then(async res => {

        // Parse the response from the 'spin' function as JSON
        let pin = JSON.stringify(res)
        let json = JSON.parse(pin)

        // Check if the response indicates that the video could not be downloaded
        if (!json.status) throw `Tidak dapat diunduh`

        // Send the downloaded video file to the user
        await conn.sendFile(m.chat, json.data.url, '', `*Mythia Batford*`, m)
    })

}

// Provide some help text for the user
handler.help = ['pinterestvideo'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^pinterestvideo$/i

// Set a limit for the number of times this function can be called
handler.limit =
