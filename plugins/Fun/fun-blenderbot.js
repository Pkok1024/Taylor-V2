import {
    HuggingFace // Importing HuggingFace module
} from '../../lib/tools/huggingface.js';

let handler = async (m, { // Defining the handler function with 'm' as the message object and 'text' as the message text
    conn, // Connection object
    args, // Array of arguments
    usedPrefix, // Prefix used in the command
    command // Command name
}) => {
    let text // Declaring the variable 'text'
    if (args.length >= 1) { // If there is at least one argument
        text = args.slice(0).join(" ") // Concatenate all the arguments into a single string
    } else if (m.quoted && m.quoted.text) { // If the message is a quoted message
        text = m.quoted.text // Use the quoted message as the input text
    } else return m.reply("Masukkan pesan!") // If there is no input text, reply with an error message
    await m.reply(wait) // Reply with a 'wait' message to indicate that the bot is processing the request
    try {
        const MODEL = 'facebook/blenderbot-400M-distill'; // Define the OpenAI model to be used
        const INPUT = (text); // Define the input text
        const openAIResponse = await HuggingFace(MODEL, INPUT); // Call the HuggingFace module with the model and input

        if (openAIResponse) { // If the response is not empty
            console.log("Respons dari OpenAI:"); // Log the response from OpenAI
            await m.reply(openAIResponse.generated_text); // Reply with the generated text from OpenAI
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan."); // Log an error message if there is no response from OpenAI
        }
    } catch (error) { // If there is an error
        console.error("Terjadi kesalahan:", error); // Log the error
        await m.reply(eror); // Reply with
