// Import required modules from 'fs' module
import {
    readdirSync, // Function to read directory
    rmSync // Function to remove synchronously
} from 'fs'

/*
Define the handler function with the following parameters:
- m: The message object
- {conn, text}: An object containing the connection instance and the text of the command
*/
const handler = async (m, {
    conn,
    text
}) => {
    // Define the directory to be cleaned
    const dir = './tmp'

    // Read the directory and synchronously remove each file
    readdirSync(dir).forEach(f => rmSync(`${dir}/${f}`));

    // Prepare the response message
    let pesan = "The *tmp* folder has been cleaned"

    // Reply to the message with the prepared message
    await m.reply(pesan)
}

// Add metadata to the handler function
handler.help = ['cleartmp']
handler.tags = ['owner']
handler.owner = false
handler.command = /^(cleartmp)$/i

// Export the handler function as the default export
export default handler
