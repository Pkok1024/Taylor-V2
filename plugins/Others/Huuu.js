import {
    sticker // Import the sticker function from '../../lib/sticker.js'
} from '../../lib/sticker.js'
import fetch from 'node-fetch' // Import the fetch function from 'node-fetch'

let handler = async (m, { // Define the handler function with async signature
    conn, // Import the connection object
    text, // Import the message text
    usedPrefix, // Import the prefix used in the message
    command // Import the command used in the message
}) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender // Get the ID of the mentioned user or the user who sent the message
    let pp = await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom()) // Get the profile picture URL of the user
    let name = await conn.getName(who) // Get the name of the user

    // Fetch a random sticker from one of the URLs in the stikerhuuu array
    let stiker = await sticker(null, global.API(`${pickRandom(stikerhuuu)}`), global.packname, global.author)
    if (stiker) return await conn.sendFile(m.chat, stiker, 'stiker.webp', '', m, null, { // Send the sticker as a file
        fileLength: fsizedoc, // Include the file size in the metadata
        contextInfo: { // Include context information in the metadata
            externalAdReply: { // Include an external ad reply in the metadata
                showAdAttribution: true, // Show the ad attribution
                mediaUrl: sig, // Include the media URL
                mediaType: 2, // Set the media type to image
                description: wm, // Include a description
                title: '👋 Hai, ' + name + ' ' + ucapan, // Set the title of the ad reply
                body: botdate, // Include the bot date in the ad reply
                thumbnail: await (await fetch(pp)).arrayBuffer(), // Set the thumbnail of the ad reply to the user's profile picture
                sourceUrl: sgc // Include the source URL
            }
        }
    })
    throw stiker.toString() // Throw an error with the sticker object as a string

}

// Set the custom prefix of the handler to /^(huuu)$/i
handler.customPrefix = /^(huuu)$/i

// Set the command of the handler to a regular expression that matches the command
handler.command = new RegExp

export default handler // Export the handler as the default export

// Define a function to pick a random element from an array
function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())] // Pick a random element from the array and return it
}

// Define an array of sticker URLs
let stikerhuuu = [
    "https://telegra.ph/file/fa2bbea0f7de2575cf027.png", //patrick huu
    "https://telegra.ph/file/4a2db7bc9f3f9ecfc007d.png", //anime yntkts
    "https://telegra.ph/file/5f6079714851d9927697e.png", //windah bocil
    "https://telegra.ph/file/d5100b4ce95a0012e88c1.png", //patrick bawa minum
    "https://telegra.ph/file/2ade25087c89f86587853.png", //pak polisi pap tt
    "https://telegra.ph/file/eb2b5e5fff569896c1639.png", //kucing1
    "https://telegra.ph/file/bd8a0e7ea01218531798b.png", //kacamata
    "https://telegra.ph/file/300610838ffa0e6576eb9.png",
