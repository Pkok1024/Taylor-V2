import {
    generateWAMessageFromContent
} from "@whiskeysockets/baileys" // Importing the generateWAMessageFromContent function from the baileys module
import cheerio from "cheerio" // Importing the cheerio module for scraping HTML data
import fetch from "node-fetch" // Importing the fetch function for making HTTP requests
import {
    youtubedl,
    youtubedlv2
} from "@bochilteam/scraper" // Importing the youtubedl and youtubedlv2 functions from the scraper module

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {

    // Defining a list of available features
    let lister = [
        "search",
        "play"
    ]

    // Splitting the input text into an array of strings using the "|" character as the separator
    let [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

    // Checking if the feature is included in the list of available features
    if (!lister.includes(feature)) {
        // If the feature is not included, returning an error message
        return m.reply("*Example:*\n.lagu123 search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
    }

    if (lister.includes(feature)) {

        if (feature == "search") {
            // If the feature is "search", checking if the inputs are provided
            if (!inputs) {
                // If the inputs are not provided, returning an error message
                return m.reply("Input query link\nExample: .lagu123 search|vpn")
            }
            // Replying with a loading message
            await m.reply(wait)
            try {
                // Calling the searchLagu123 function with the inputs as the argument
                let res = await searchLagu123(inputs)
                // Creating a string of search results using the map function
                let teks = res.map((item, index) => {
                    return `🔍 *[ RESULT ${index + 1} ]*

🖼️ *imageSrc:* ${item.imageSrc}
📰 *title:* ${item.title}
🌐 *url:* ${item.url}
▶️ *playUrl:* ${item.playUrl}
🔊 *audioUrl:* ${item.audioUrl}
🎥 *videoUrl:* ${item.videoUrl}
⬇️ *downloadUrl:* ${item.downloadUrl}
`
                }).filter(v => v).join("\n\n________________________\n\n")

                // Fetching the thumbnail image using the conn.getFile function
                let ytthumb = await (await conn.getFile(res[0].detailThumb)).data
                // Creating a message object using the generateWAMessageFromContent function
                let msg = await generateWAMessageFromContent(m.chat, {
                    extendedTextMessage: {
                        text: teks,
                        jpegThumbnail: ytthumb,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            externalAdReply: {
                                body: "L I R I K",
                                containsAutoReply: true,
                                mediaType: 1,
                                mediaUrl: res[0].downloadLink,
                                renderLargerThumbnail: true,
                                showAdAttribution: true,
                                sourceId: "WudySoft",
                                sourceType: "PDF",
                                previewType: "PDF",
                                sourceUrl: res[0].downloadLink,
                                thumbnail: ytthumb,
                                thumbnailUrl: res[0].detailThumb,
                                title: htki + " C A F E L A G U " + htka
                            }
                        }
                    }
                }, {
                    quoted: m
                })
                // Sending the message object using the conn.relayMessage function
                await conn.relayMessage(m.chat, msg.message, {})
            } catch (e) {
                // If there is an error, replying with an error message
                await m.reply(eror)
            }
        }

        if (feature == "play") {
            // If the feature is "play", checking if the inputs match the youtu regex pattern
            if (!inputs.match(/youtu/gi)) {
                // If the inputs do not match the pattern, returning an error message
                return m.reply("Input query link\nExample: .lagu123 play|link")
            }
            // Replying with a loading message
            await m.reply(wait)
            try {
                // Calling the youtubedlv2 function with the inputs as the argument
                const yt = await youtubedlv2(inputs).catch(async _ => await youtubedl(inputs))
                // Fetching the audio file using the download function
                const link = await yt.audio["128kbps"].download()
                // Defining some variables for the media file
                let ytl = "https://youtube.com/watch?v="
                let dls = "Downloading audio succes"
                // Fetching the thumbnail image using the conn.getFile function
                let ytthumb = await (await conn.getFile(yt.thumbnail)).data
                // Creating a message object using the document object
                let doc = {
                    audio: {
                        url: link
                    },
                    mimetype: "audio/mp4",
                    fileName: yt.title,
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            mediaType: 2,
                            mediaUrl: ytl + yt.id,
                            title: yt
