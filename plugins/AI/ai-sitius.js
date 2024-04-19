import fetch from 'node-fetch';

// Handler function for the "sitius" command
const handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    // Generate input data using the "generateModel" function
    const input_data = await generateModel();

    // Split the user input into "urutan" and "tema"
    let [urutan, tema] = text.split("|")

    // Check if "tema" is not provided and reply with the correct usage
    if (!tema) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]")

    // Reply with a loading message
    await m.reply(wait)

    try {
        // Create an array of data objects with "title" and "id" properties
        let data = input_data.map((item, index) => ({
            title: item.replace(/[_-]/g, ' ').replace(/\..*/, ''),
            id: item
        }));

        // Check if "urutan" is not provided and reply with the correct usage
        if (!urutan) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))

        // Check if "urutan" is not a number and reply with the correct usage
        if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))

        // Check if "urutan" is greater than the length of the "data" array and reply with the correct usage
        if (urutan > data.length) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))

        // Get the selected model ID from the "data" array
        let out = data[urutan - 1].id

        // Generate an image using the selected model and prompt
        const openAIResponse = await generateImage(out, tema);

        // Check if the response is not empty and send the image message
        if (openAIResponse) {
            const result = openAIResponse;
            const tag = `@${m.sender.split('@')[0]}`;

            await conn.sendMessage(m.chat, {
                image: {
                    url: result.url
                },
                caption: `Nih effect *${out}* nya\nRequest by: ${tag}`,
                mentions: [m.sender]
            }, {
                quoted: m
            });
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (e) {
        // Catch any errors and reply with an error message
        await m.reply(eror)
    }
}

// Command information for the "sitius" command
handler.help = ["sitius *[nomor]|[query]*"]
handler.tags = ["ai"]
handler.command = /^(sitius)$/i

// Export the "handler" function as the default export
export default handler

// Function to generate an image using the OpenAI API
async function generateImage(model, prompt) {
    try {
        // Make a POST request to the OpenAI API to generate an image
        const response = await fetch('https://api.sitius.tech/gen/', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                negative: '',
                model
            }),
        });

        // Check if the response is successful and return the response data
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Gagal melakukan permintaan ke server');
        }
    } catch (error) {
        // Catch any errors and throw them
        console.error('Terjadi kesalahan:', error);
        throw error;
    }
}

// Function to get the list of available models from the OpenAI API
async function generateModel() {
    try {
        // Make a GET request to the OpenAI API to get the list of available models
        const response = await fetch('https://api.sitius.tech/models/', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        // Check if the response is successful and return the response data
