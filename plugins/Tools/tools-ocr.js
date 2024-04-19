// Import required libraries and functions
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import {
    webp2png
} from '../../lib/webp2mp4.js'
import fetch from 'node-fetch'

// Define the handler function for the ocr command
const handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    let out; // Variable to store the output of the media conversion

    // Check if the user has replied to a media message
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || ''; // Get the mimetype of the media message

    // Check if the mimetype is a supported media type
    if (!/webp|image|video|gif|viewOnce/g.test(mime)) {
        return m.reply(`Reply Media dengan perintah\n\n${usedPrefix + command}`);
    }

    // Download the media message
    let img = await q.download?.();

    // Convert the media message to a suitable format for OCR
    if (/webp/g.test(mime)) {
        out = (await webp2png(img));
    } else if (/image/g.test(mime)) {
        out = (await uploadImage(img));
    } else if (/video/g.test(mime)) {
        out = (await uploadFile(img));
    } else if (/gif/g.test(mime)) {
        out = (await uploadFile(img));
    } else if (/viewOnce/g.test(mime)) {
        out = (await uploadFile(img));
    }

    // Send a waiting message to the user
    await m.reply(wait);

    try {
        // Make a request to the OCR API
        let res;
        if (args[0]) {
            res = await (await fetch("https://api.ocr.space/parse/imageurl?apikey=helloworld&url=" + out + "&language=" + args[0])).json();
        } else {
            res = await (await fetch("https://api.ocr.space/parse/imageurl?apikey=helloworld&url=" + out)).json();
        }

        // Send the OCR result to the user
        await m.reply("*Result:*\n\n" + res.ParsedResults[0].ParsedText);
    } catch (e) {
        // Handle
