// Import the 'serpapi.js' module and destructure the 'generateSerpApiUrl' function from it
const { generateSerpApiUrl } = await (await import('../../lib/serpapi.js'));

// Define the 'handler' function, which takes in several parameters including 'm', 'command', 'usedPrefix', 'conn', 'text', and 'args'
const handler = async (m, { command, usedPrefix, conn, text, args }) => {
    // Split the input text into 'tema' and 'urutan' using a regex pattern
    let [tema, urutan] = text.split(/[^\w\s]/g);

    // Check if 'tema' is not provided and return an error message if it's not
    if (!tema) return m.reply("Input query!\n*Example:*\n.viewmap [area]|[nomor]");

    // Reply with a loading message
    await m.reply(wait);

    try {
        // Define the 'param' object with the required parameters for the 'generateSerpApiUrl' function
        const param = {
            api_key: 'f70cce2ec221209bcd45af4533adbbc51c51b682c29251b618061115c6e95d5c',
            engine: 'google_maps',
            q: tema
        };

        // Call the 'generateSerpApiUrl' function with the 'param' object and wait for the response
        let all = await generateSerpApiUrl(param);

        // Extract the 'local\_results' array from the response
        let data = all.local\_results;

        // Check if 'urutan' is not provided and return an error message if it's not
        if (!urutan) return m.reply("Input query!\n*Example:*\n.viewmap [area]|[nomor]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));

        // Check if 'urutan' is not a number and return an error message if it's not
        if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.viewmap [area]|[nomor]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));

        // Check if 'urutan' is greater than the length of the 'data' array and return an error message if it is
        if (urutan > data.length) return m.reply("Input query!\n*Example:*\n.viewmap [area]|[nomor]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));

        // Extract the selected data from the 'data' array based on the 'urutan' input
        let out = data[urutan - 1];

        // Construct the caption string with the required details
        let caption = `🔍 *[ HASIL ]*

🆔 *ID:* ${out.place\_id || 'Tidak ada'}
📋 *Deskripsi:* ${out.title || 'Tidak ada'}
📍 *Alam
