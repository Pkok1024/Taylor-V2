import { default as Jimp } from 'jimp'; // Importing Jimp library to manipulate images
import { default as qrcode } from 'qrcode-reader'; // Importing qrcode-reader library to read QR codes

let handler = async (m, { conn, usedPrefix, args, command }) => {
    // Check if the quoted message contains an image with JPEG or PNG format
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!/image\/(jpe?g|png)/.test(mime))
        return conn.reply(m.chat, 'Mohon kirim gambar dengan format JPEG atau PNG.', m); // Reply with an error message if the image format is not supported

    const mediaData = await q.download(); // Download the media data
    const image = await Jimp.read(mediaData); // Read the image using Jimp

    try {
        // Attempt to read the QR code from the image
        const result = await readQRCode(image);
        await conn.reply(m.chat, result, m); // Reply with the QR code value if successful
    } catch (error) {
        await conn.reply(m.chat, 'Terjadi kesalahan dalam membaca QR code', m); // Reply with an error message if there's an error in reading the QR code
    }
};

// Define the help, tags, and command for the handler
handler.help = ['readqr'];
handler.tags = ['tools'];
handler.command = /^readqr(code)?$/i;

// Export the handler
export default handler;

// Define the readQRCode function to read the QR code from an image
const readQRCode = (image) => {
    return new Promise((resolve, reject) => {
        // Create a new instance of the qrcode-reader
        const qr = new qrcode();

        // Define the callback function to handle the result or
