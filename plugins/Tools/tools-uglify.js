// Import the 'uglify-js' package to minify and obfuscate JavaScript code
import uglify from 'uglify-js';

// Define the async function handler to process incoming messages
const handler = async (m, {
    args, // The array of arguments passed in the message
    command, // The command used in the message
    usedPrefix // The prefix used in the message
}) => {
    // Define the usage string for the command
    const usage = `*Example:*
${usedPrefix}${command} (Input text or reply text to enc code)
${usedPrefix}${command} doc (Reply to a document)`;

    let text; // Declare the variable to store the text to be encrypted

    // Check if arguments are present and join them into a single string
    if (args.length >= 1) {
        text = args.join(" ");
    }
    // If no arguments are present, check if a quoted message is present
    else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    }
    // If no quoted message is present, reply with the usage string
    else {
        return m.reply(usage);
    }

    try {
        // If the text is 'doc' and a quoted document message is present
        if (text === 'doc' && m.quoted && m.quoted.mtype === 'documentMessage') {
            let docBuffer; // Declare the variable to store the downloaded document buffer
            // Download the document and convert it to a string
            if (m.quoted.mimetype) {
                docBuffer = await m.quoted.download();
            }
            // Encrypt the document string and send the result as a message
            const message = await Encrypt(docBuffer.toString('utf-8'));
            await m.reply(message);
        } else {
            // Encrypt the text and send the result as a message
            const message = await Encrypt(text);
            await m.reply(message);
        }
    } catch (error) {
        // If an error occurs, send an error message
        const errorMessage = `Terj
