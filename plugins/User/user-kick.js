// Importing the 'fs' module for handling file system operations
import fs from 'fs'

// Defining the 'handler' function which takes 'm', 'conn', and 'args' as parameters
const handler = async (m, {
    conn, // The WhatsApp connection object
    args // Command arguments passed by the user
}) => {
    // Extracting the owner group ID from the chat ID
    const ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net'

    // Extracting the list of users mentioned in the command
    const aki = m.quoted ? [m.quoted.sender] : m.mentionedJid

    // Filtering the users who are not the owner or the bot itself
    const users = aki.filter(u => !(u == ownerGroup || u.includes(conn.user.jid)))

    // Initializing the 'wayy' variable with the 'Kick' message and the first mentioned user
    let wayy = '*Kick*' + ` @${users[0].split('@')[0]}`

    // Looping through the remaining mentioned users and appending them to the 'wayy' message
    for (let i = 1; i < users.length; i++) {
        wayy += ` @${users[i].split('@')[0]}`
    }

    // Replying to the user with the 'wayy' message and mentioning the kicked users
    conn.reply(m.chat, wayy, m, {
        contextInfo: {
            mentionedJid: users
        }
    })

    // Looping through the kicked users and removing them from the group
    for (let user of users) {
        // Checking if the user is a WhatsApp user (ends with '@s.whatsapp.net')
        if (user.endsWith('@s.whatsapp.net')) {
            // Removing the user from the group
            await conn.groupParticipantsUpdate(m.chat, [user], "remove")
        }
    }
}

// Adding command
