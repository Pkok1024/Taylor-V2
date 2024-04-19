import fetch from 'node-fetch';

// Handler function for the "chawnyma" command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    // Check if input query is provided, if not reply with an error message
    if (!text) return m.reply("Input query\nExample: .chawnyma hello")
    
    // Reply with a loading message while fetching the completion
    await m.reply(wait);
    try {
        // Fetch completion using the fetchCompletion function
        const result = await fetchCompletion(text);
        // Reply with the fetched completion
        await m.reply(result);
    } catch (error) {
        // If there is an error, reply with the error message
        await m.reply(error);
    }
}

// Help and tags for the "chawnyma" command
handler.help = ["chawnyma"]
handler.tags = ["internet", "ai", "gpt"];

// Regular expression for the "chawnyma" command
handler.command = /^(chawnyma)$/i

// Export the handler function to be used as a command
export default handler

// Function to fetch completion using the ChatAnywhere API
const fetchCompletion = async (inputValue) => {
    try {
        // URL for the ChatAnywhere API
        const chatApiUrl = 'https://api.chatanywhere.com.cn/v1/chat/completions';

        // Configuration for the fetch request
        const chatResponse = await fetch(chatApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sk-pu4PasDkEf284PIbVr1r5jn9rlvbAJESZGpPbK7OFYYR6m9g', // Authorization token
                'Content-Type': 'application/json;charset=UTF-8', // Content type for the request body
            },
            body: JSON.stringify({ // Request body
                model: "gpt-3.5-turbo", // Model to be used for completion
                messages: [{ // Messages to be sent to the model
                    role: "system",
                    content: "Kam
