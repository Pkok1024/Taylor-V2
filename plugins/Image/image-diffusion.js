import fetch from "node-fetch";

// Handler function to process incoming messages
const handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    args
}) => {
    // Help text for the command
    const query = "input text\nEx. .diffusion hello world\n<command> <text>";
    
    // The text to be processed
    let text;
    if (args.length >= 1) {
        // If arguments are provided, join them into a single string
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        // If a message is quoted, use its text as input
        text = m.quoted.text;
    } else {
        // If no input is provided, throw an error with the help text
        throw query;
    }
    
    try {
        // Reply to the message with a loading indicator
        m.reply(wait);
        
        // Call the Draw function to generate an image from the input text
        await Draw(text).then((img) => {
            // Send the generated image to the chat
            conn.sendFile(m.chat, img, text, "*[ Result ]*\n" + text, m);
        });
    } catch (e) {
        // If an error occurs, throw an error message
        throw eror;
    }
}

// Configuration for the handler function
handler.help = ["diffusion"];
handler.tags = ["misc"];
handler.command = /^(diffusion)$/i;

// Export the handler function as the default export
export default handler;


// Function to generate an image from a given prompt using the Stable Diffusion model
const Draw = async (propmt) => {
    // Fetch the model from the Hugging Face Inference API
    const Blobs = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
            headers: {
                Authorization:
