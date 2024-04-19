import {
    areJidsSameUser
} from '@whiskeysockets/baileys' // Import the areJidsSameUser function from the baileys library

// Define the handler function that will be executed when the command is called
const handler = async (m, {
    conn, // Connection object
    participants // Array of participants in the group
}) => {
    // Filter the mentioned JIDs to exclude the bot's JID
    const users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
    const promoteUser = [] // Initialize an empty array to store the users to be promoted

    // Loop through the filtered users
    for (let user of users)
        // Check if the user is a WhatsApp user and not already an admin in the group
        if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || {
                admin: true
            }).admin) {
            // Promote the user to admin and wait for 1 second before continuing
            const res = await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
            await delay(1 * 1000)
        }

    // Reply to the message with "Succes"
    m.reply('Succes')

}

// Add command metadata
handler.help = ['opromote @tag']
handler.tags = ['owner']
handler.command = /^(opromote)$/i

// Set owner and group-related properties
handler.owner = true
handler.group = true
handler.botAdmin = true

// Export the handler function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
export default handler
