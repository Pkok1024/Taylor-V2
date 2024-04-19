// This is a function handler that will process messages containing a specific command
function handler(m, {
    text // The text of the message
}) {
    // Extract the text to be replaced from the message
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text

    // Replace each letter in the text with its corresponding Japanese word
    m.reply(teks.replace(/[a-z]/gi, v => {
        // Define a replacement object for each letter
        return {
            'a': 'ka',
            'b': 'tu',
            'c': 'mi',
            'd': 'te',
            'e': 'ku',
            'f': 'lu',
            'g': 'ji',
            'h': 'ri',
            'i': 'ki',
            'j': 'zu',
            'k': 'me',
            'l': 'ta',
            'm': 'rin',
            'n': 'to',
            'o': 'mo',
            'p': 'no',
            'q': 'ke',
            'r': 'shi',
            's': 'ari',
            't': 'ci',
            'u': 'do',
            'v': 'ru',
            'w': 'mei',
            'x': 'na',
            'y': 'fu',
            'z': 'zi'
        } [v.toLowerCase()] || v // If the letter is not found in the object, return the original letter
    }))
}

// Add a help command for the handler
handler.help = ['namaninja'].map(v => v + ' <teks>')

// Tag the handler as a fun command
handler.tags = ['fun']

// Define the command that triggers the handler
handler.command = /^(namaninja|namae)$/i

// Export the handler for use in other modules
export default handler
