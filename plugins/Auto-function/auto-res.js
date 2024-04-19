import fetch from 'node-fetch'; // Importing the node-fetch module to make HTTP requests
import fs from 'fs'; // Importing the built-in file system module to read and write files

export async function all(m) {
    // Exporting an asynchronous function named "all" that takes a single parameter "m"

    if (!this || m.isBaileys || m.chat.endsWith('broadcast') || !m.isGroup || !m.sender || !m.mentionedJid.includes(this.user.jid)) 
        // Checking if the message is not from a group chat, or if the current instance is not defined, or if the message is a broadcast, or if the sender is not mentioned, or if the sender is not a bot user
        return;

    try {
        // Beginning a try-catch block to handle any errors that might occur during the execution of the function

        let pp = await this.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
        // Fetching the profile picture URL of the sender. If an error occurs, using a default image URL instead.

        let stc = await fs.promises.readFile(`./sticker/ress${pickRandom(1, 9)}.webp`);
        // Reading the sticker file from the file system using the "pickRandom" function to select a random sticker.

        await this.sendMessage(m.chat, {
            // Sending a message to the chat using the "sendMessage" method

            sticker: stc, // Attaching the sticker to the message
            thumbnail: await (await fetch(pp)).arrayBuffer(), // Setting the thumbnail of the message to the profile picture of the sender

            contextInfo: {
                // Adding context information to the message

                externalAdReply: {
                    // Creating an external ad reply object

                    showAdAttribution: true, // Showing the ad attribution
                    mediaType: 1
