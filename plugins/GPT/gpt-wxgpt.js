import cheerio from 'cheerio';
import fetch from 'node-fetch';

// The handler function is the main entry point for this module.
// It receives several arguments, including the message object (m),
// the command arguments (args), the prefix used for commands (usedPrefix),
// the text of the command (text), and the name of the command (command).
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    // Check if the text argument is empty and reply with an error message if it is.
    if (!text) return m.reply("Input query\nExample: " + usedPrefix + "wxgpt hello")
    // Reply to the message with a loading indicator while the API request is being processed.
    await m.reply(wait)
    try {
        // Call the wxGpt function with the text argument as the input query.
        let result = await wxGpt(text)
        // Reply to the message with the result from the API request.
        await m.reply(result)
    } catch (e) {
        // If there is an error, reply to the message with an error message.
        await m.reply(eror)
    }
}

// The handler function is associated with the "wxgpt" command.
handler.help = ["wxgpt"]
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(wxgpt)$/i

// Export the handler function as the default export of this module.
export default handler

/* New Line */

// The wxGpt function is an asynchronous function that sends a POST request to a third-party API.
// It receives the input query as an argument (you_qus).
async function wxGpt(you_qus) {
    // Set the base URL for the API requests.
    let baseURL = "https://free-api.cveoy.top/";
    try {
        // Send a POST request to the API endpoint with the input query as an argument.
        const response = await fetch
