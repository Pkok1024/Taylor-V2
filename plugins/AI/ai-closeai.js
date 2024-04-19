import cheerio from 'cheerio'; // Cheerio library is used for manipulating HTML documents using CSS selectors.
import fetch from 'node-fetch'; // Node-fetch library is used for making HTTP requests in Node.js.

// Array of API base URLs for making requests to the CloseAI and OpenAI proxies.
const API_BASE = ["https://api.closeai-proxy.xyz", "https://api.openai-proxy.live"];

// The API key for authentication with the CloseAI proxy.
const API_KEY = "sk-zaTFbMjIUsKv23JlrhbyYdJG6A9gNOK2G713GvoZ0TBRkfI3";

// The IDs of the GPT-3.5-turbo and GPT-4 models.
const MODEL_3_5 = "gpt-3.5-turbo";
const MODEL_4 = "gpt-4";

// The handler function for the closeai command.
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    // Check if the user provided a query for the AI to process.
    if (!text) return m.reply("Input query\nExample: .closeai hello")

    // Notify the user that their query is being processed.
    await m.reply(wait);

    try {
        // Define the messages to be sent to the AI.
        const messages = [{
                role: 'system',
                content: 'Hello!'
            },
            {
                role: 'user',
                content: text
            },
        ];

        // Call the fetchCompletion function to get the AI's response.
        const result = await fetchCompletion(MODEL_3_5, messages);

        // Send the AI's response to the user.
        await m.reply(result);
    } catch (e) {
        try {
            // If there was an error with the first API, try using the second API.
            const messages = [{
                    role: 'system',
                    content: 'Hello!'
                },
                {
                    role: 'user',
                    content: text
                },
            ];

            // Call the fetchCompletion function to get the AI's response.
            const result = await fetchCompletion(MODEL_3_5, messages, true);

            // Send the AI's response to the user.
            await m.reply(result);
        } catch (error) {
            // If there was an error with both APIs, send the error message to the user.
            await m.reply(error);
        }
    }
}

// Set the help, tags, and command properties for the handler function.
handler.help = ["closeai"]
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(closeai)$/i

// Export the handler function so it can be used in other modules.
export default handler

// The fetchCompletion function is used to make a request to the CloseAI or OpenAI proxy and get the AI's response.
async function fetchCompletion(model, messages, useSecondAPI = false) {
    // Determine which API to use based on the useSecondAPI parameter.
    let url = useSecondAPI ? API_BASE[1] : API_BASE[0];

    try {
        // Make a POST request to the API with the required headers and body.
        const response = await fetch(`${url}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model,
                stream: true,
                temperature: 0
