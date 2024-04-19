import {
    FormData,
    Blob
} from 'formdata-node';
import {
    fileTypeFromBuffer
} from 'file-type';
import fetch from 'node-fetch'

// The handler function is the main entry point for this module.
// It receives several arguments from the WhatsApp bot API, such as the message object (m),
// the command used in the message, the prefix used for commands, the connection object,
// the text of the message, and the arguments provided in the message.
let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    // An array of possible input data options
    const input_data = [
        "pixar",
        "pixar_plus",
        "3d_cartoon",
        "angel",
        "angel_plus",
        "demon",
        "ukiyoe_cartoon",
        "bopu_cartoon",
        "amcartoon",
        "western",
        "avatar",
        "famous",
        "jpcartoon",
        "jpcartoon_head",
        "hkcartoon",
        "classic_cartoon",
        "tccartoon",
        "anime",
        "handdrawn",
        "sketch",
        "artstyle",
        "head",
        "full",
        "3d_game"
    ]

    // The quoted message object, or the message object itself if no quote is present
    let q = m.quoted ? m.quoted : m

    // The mimetype of the message media
    let mime = (q.msg || q).mimetype || ''

    // If no media is found in the message, throw an error
    if (!mime) throw 'No media found'

    // Download the media from the message
    let media = await q.download()

    // Extract the first word from the message text as the query number
    let [urutan] = text.split(" ")

    // Reply to the message with a "wait" message
    await m.reply(wait)

    try {
        // Map the input_data array to an array of objects, each containing a title and an id
        let data = input_data.map(item => ({
            title: item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            id: item
        }));

        // If no query number is provided, reply with usage instructions
        if (!urutan) return m.reply("Input query!\n*Example:*\n.ailabs [nomor]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))

        // If the query number is not a number, reply with usage instructions
        if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.ailabs [nomor]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))

        // If the query number is greater than the length of the input_data array, reply with usage instructions
        if (urutan > data.length) return m.reply("Input query!\n*Example:*\n.ailabs [nomor]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))

        // Extract the id corresponding to the query number
        let out = data[urutan - 1].id

        // Call the cartoonifyImage function with the media buffer and the selected type as arguments
        const openAIResponse = await cartoonifyImage(media, out);

        // If the OpenAI response is not null, send the resulting image to the chat
        if (openAIResponse) {
            const result = openAIResponse;
            const tag = `@${m.sender.split('@')[0]}`;
            await conn.sendMessage(m.chat, {
                image: {
                    url: result.data.image_url
              `},
                caption: \`Nih effect \*${out}* nya\nRequest by: ${tag}\`,
                mentions: [m.sender]
            }, {
                quoted: m
            });
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (e) {
        // If an error occurs, reply with an "error" message
        await m.reply(eror)
    }
}

// The handler function is assigned several properties that define its behavior
handler.help = ["ailabs [nomor]"]
handler.tags = ["ai"]
handler.command = /^(ailabs)$/i
handler.limit = true

// Export the handler function as the default export of this module
export default handler

// The cartoonifyImage function takes a media buffer and a type string as arguments
// and returns a promise that resolves to the OpenAI response
async function cartoonifyImage(buffer, type) {
    // Create a new FormData object to hold the image data
    const data = new FormData();

    // Determine the file type of the media buffer
    const fileType = await fileTypeFromBuffer(buffer) || {};

    // Extract the mimetype and extension from the file type
