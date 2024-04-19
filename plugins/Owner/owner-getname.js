// Define an asynchronous handler function that takes in 'm' (message object),
// 'conn' (connection object), and 'command' (command string) as parameters.
let handler = async (m, {
    conn, // Connection object
    command // Command string
}) => {
    try {
        // Check if the message is from a group chat
        if (m.isGroup) {
            // If it is, get the first mentioned JID or the quoted message sender's JID
            who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
        } else {
            // If it's not, get the quoted message sender's JID or the sender's JID
            who = m.quoted.sender ? m.quoted.sender : m.sender
        }

        // Get the name of the user with the specified JID
        let name = await conn.getName(who)

        // Reply to the message with the user's name
        m.reply(name)
    } catch (err) {
        try {
            // If there was an error, try getting the name of the quoted message sender
            who = m.quoted ? m.quoted.sender : m.sender
            let name = await conn.getName(who)
            m.reply(name)
        } catch {
            // If there's still an error, throw an error message
            throw `sorry gk bisa coba yang lain⍨`
        }
    }
}

// Set the help message for the handler
handler.help = ['getname <@tag/reply>']

// Set the tags for the handler
handler.tags = ['owner']

// Set the command regular expression for the handler
handler.command = /^(get)?name?a?$/i

// Set the owner-only status for the handler
handler.owner = true

// Export the handler as the default export
export default handler
