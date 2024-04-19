// Import required modules
const { Primbon } = await (await import('../../lib/scraped-primbon.js'))

// Create an instance of Primbon class
const primbon = new Primbon()

/*
Handler function for the 'peruntungan' command.
This function is responsible for processing the user's input and generating a response.
*/
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text // Declare a variable to store the user's input

    // Check if the user has provided any arguments
    if (args.length >= 1) {
        // Combine all the arguments into a single string
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        // If the user has quoted a message, use its text as input
        text = m.quoted.text
    } else {
        // If no input is provided, reply with an error message
        return m.reply("Masukkan pesan!")
    }

    // Reply with a 'wait' message while processing the request
    await m.reply(wait)

    try {
        // Split the input text into an array of strings
        const inputText = text.split("|");

        // Check if the input text array has exactly 5 elements
        if (inputText.length === 5 && inputText.every(input => input.trim() !== '')) {
            // Call the 'ramalan_peruntungan' method of the Primbon instance
            const ramalanPeruntungan = await primbon.ramalan_peruntungan(
                inputText[0], inputText[1], inputText[2], inputText[3], inputText[4]
            );

            // Generate the response message based on the ramalanPeruntungan object
            const caption = `
=== Ramalan Peruntungan ===
Nama: ${ramalanPeruntungan.message.nama}
Tanggal Lahir: ${ramalanPeruntungan.message.tgl_lahir}
Peruntungan Tahun: ${ramalanPeruntungan.message.peruntungan_tahun}
Hasil Ramalan:
${ramalanPeruntungan.message.result}

Catatan:
${ramalanPeruntungan.message.catatan}
`;

            // Reply with the generated response message
            await m.reply(caption);
        } else {
            //
