// Importing the 'readFileSync' function from the 'fs' (File System) module
import {
    readFileSync
} from "fs";

// Defining the 'handler' function which handles incoming messages
const handler = async (m, {
    conn, // Connection object
    text // The text content of the message
}) => {
    // Sending a message with a reaction using the 'conn' object
    conn.sendMessage(m.chat, {
        // The type of message reaction
        react: {
            // The text content of the reaction
            text: emojis,
            // The unique identifier of the message to react to
            key: m.key,
        }
    })
}

// Setting the custom prefixes for the 'handler' function
handler.customPrefix = /^(anjir|((bil|ad)e|dec)k|tytyd|laik|banh|nihh)$/i

// Defining the command regular expression for the 'handler' function
handler.command = new RegExp()

// Setting the 'mods' property of the 'handler' function to 'false'
handler.mods = false

// Exporting the 'handler' function as the default export
export default handler
