// Importing the 'fs' module for file system operations
import fs from 'fs'

// Defining the handler function for the 'sf' command
const handler = async (m, { text, usedPrefix, command }) => {
    // Check if the text argument is not provided
    if (!text) {
        // Throw an error message
        throw `uhm.. teksnya mana?\n\npenggunaan:\n${usedPrefix + command} <teks>\n\ncontoh:\n${usedPrefix + command} plugins/melcanz.js`
    }

    // Check if the quoted message is not provided
    if (!m.quoted.text) {
        // Throw an error message
        throw `balas pesan nya!`
    }

    // Define the path for the file to be saved
    let path = `${text}`

    // Save the quoted message to the file
    await fs.writeFileSync(path, m.quoted.text)

    // Reply to the user with the file path
    m.reply(`tersimpan di ${path}`)
}

// Set the help and tags for the command
handler.help = ['sf'].map(v => v + ' <teks>')
handler.tags = ['owner']

// Set the command name and pattern
handler.command = /^sf$/i

// Set the command as owner-only
handler.rowner = true

// Export the handler function
export default handler
