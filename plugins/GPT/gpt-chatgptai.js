import axios from 'axios';

// Handler function to process the chatgptai command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    // Check if the user provided any text as input
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } 
    // If no text is provided, use the text from the quoted message
    else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } 
    // If no text is provided, throw an error
    else throw "Input Teks"
    
    // Reply to the user with a loading message
    await m.reply(wait)
    
    try {
        // Call the generate function to get the response from the ChatGPT API
        let result = await generate(text)
        // Reply to the user with the generated response
        await m.reply(result.reply)
    } catch (e) {
        // If there is an error, reply to the user with an error message
        await m.reply(eror)
    }
}

// Add command information to the handler function
handler.help = ["chatgptai"]
handler.tags = ["gpt"];
handler.command = /^(chatgptai)$/i

// Export the handler function to make it available for use
export default handler

/* New Line */

// Function to generate a response from the ChatGPT API
async function generate(q) {
    try {
        // Call the ChatGPT API and parse the response
        const {
            data
        } = await axios(
            `https://chatgpt.ai/wp-json/mwai-ui/v1/chats/submit`, {
                method: "post",
                data: {
                    botId: "default",
                    newMessage: q,
                    stream: false,
                },
                headers: {
                    Accept: "text/event-stream
