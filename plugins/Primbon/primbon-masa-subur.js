// Import required modules
const { Primbon } = await (await import('../../lib/scraped-primbon.js'))

// Create an instance of Primbon class
const primbon = new Primbon()

// Define the handler function for the 'masasubur' command
const handler = async (m, { conn, args, usedPrefix, command }) => {
    let text // Declare a variable to store the input text

    // Check if the user provided any arguments
    if (args.length >= 1) {
        // Combine all the arguments into a single string
        text = args.slice(0).join(" ")
    } 
    // If the user didn't provide any arguments, check if the message is a quote
    else if (m.quoted && m.quoted.text) {
        // Set the text to the content of the quoted message
        text = m.quoted.text
    } 
    // If there's still no text, reply to the user asking for input
    else return m.reply("Masukkan pesan!")

    // Reply to the user with a loading indicator
    await m.reply(wait)

    try {
        // Split the input text into an array of strings using '|' as the separator
        const inputText = text.split("|");

        // Check if the array has exactly 4 elements and none of them are empty
        if (inputText.length === 4 && inputText.every(input => input.trim() !== '')) {
            // Call the 'masa_subur' method of the Primbon instance with the input data
            const masaSubur = await primbon.masa_subur(inputText[0], inputText[1], inputText[2], inputText[3]);

            // Create a caption string with the result and notes
            const caption = `
=== Kalkulator Masa Subur ===
Hasil: ${masaSubur.message.result}
Catatan: ${masaSubur.message.catatan}
`;

            // Reply to the user with the result
            await m.reply(caption);
        } else {
            // Log an error message
