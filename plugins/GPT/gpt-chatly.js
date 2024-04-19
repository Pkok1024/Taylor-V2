import axios from 'axios';

// The `handler` function is the main entry point for this module.
// It is responsible for processing incoming messages and generating responses using the GPTChatly API.
const handler = async (m, {
    text
}) => {
    // Check if the message has a text payload.
    if (!text) throw 'Contoh: .gptchatly Pesan yang ingin Anda sampaikan kepada asisten AI';

    // Reply to the message with a "wait" message to indicate processing.
    m.reply(wait);

    // Encode the message text for use in a URL.
    const messages = encodeURIComponent(text)

    try {

        // Call the `getgptchatlyResponse` function to get the GPTChatly API response.
        const response = await getgptchatlyResponse(messages);

        // Reply to the message with the GPTChatly API response.
        m.reply(response.chatGPTResponse);
    } catch (error) {
        // Log any errors to the console.
        console.error('Error:', error);

        // Reply to the message with an "error" message if there was a problem processing the request.
        m.reply(eror);
    }
};

// Add metadata to the `handler` function to indicate that it is a command handler.
handler.help = ['gptchatly'];
handler.tags = ['ai', 'gpt'];
handler.command = /^(gptchatly)$/i;

// Export the `handler` function as the default export of this module.
export default handler;

// The `generateRandomIP` function generates a random IP address in the form of a string.
// It is used to set the `X-Forwarded-For` header in the GPTChatly API request.
function generateRandomIP() {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

// The `getgptchatlyResponse` function sends a POST request to the GPTChatly API and returns the response.
// It sets various headers to mimic a WhatsApp client and includes the message text in the request body.
async function getgptchatlyResponse(content) {
    const url = 'https://gptchatly.com/fetch-response';

    // Set up the headers for the GPTChatly API request.
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; M2004J19C Build/RP1A.
