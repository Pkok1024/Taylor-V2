import cheerio from 'cheerio';
import fetch from 'node-fetch';

/**
 * The main handler function for the voice command.
 * @param {Object} m - The message object.
 * @param {Object} args - The arguments object.
 * @param {Function} conn - The connection object.
 * @param {string} usedPrefix - The prefix used in the command.
 * @param {string} text - The text of the message.
 * @param {string} command - The command used.
 * @returns {Promise} A promise that resolves when the function is complete.
 */
const handler = async (m, {
    conn,
    usedPrefix,
    text,
    command
}) => {
    // Extract the arguments from the text
    const args = text.trim().split(/\s+/);

    // Check if the first argument is empty
    if (!args[0]) {
        // Fetch the list of voices from voiceV1 and return the message
        const voices = await voiceV1();
        const message = voices.length === 0 ? '❓ Daftar suara kosong.' : `🔊 *Daftar Suara:*\n${voices.map((voice, index) => `*${index + 1}.* ${voice.name}`).join('\n')}`;
        return await m.reply(message);
    }

    // Check if the first argument is a number
    const linkIndex = parseInt(args[0], 10) - 1;
    if (args.length === 1 && /^\d+$/.test(args[0])) {
        // Fetch the list of voices from voiceV1 and return the message
        const voices = await voiceV1();
        if (linkIndex >= 0 && linkIndex < voices.length) {
            const listVoices = await ListVoice(voices[linkIndex].link);
            const message = listVoices.length === 0 ? '❓ Daftar suara kosong.' : `🔊 *Daftar Suara dari Link ${linkIndex + 1}:*\n${listVoices.map((voice, index) => `*${index + 1}.* ${voice.name}`).join('\n')}`;
            return await m.reply(message);
        } else {
            return await m.reply('❌ Indeks link tidak valid. Harap pilih indeks link yang valid.\nContoh penggunaan: *voice 1*');
        }
    }

    // Check if the first two arguments are numbers
    if (args.length === 2 && /^\d+$/.test(args[0]) && /^\d+$/.test(args[1])) {
        // Fetch the list of voices from voiceV1 and return the message
        const voiceIndex = parseInt(args[1], 10) - 1;
        const voices = await voiceV1();
        if (linkIndex >= 0 && linkIndex < voices.length) {
            const listVoices = await ListVoice(voices[linkIndex].link);
            if (voiceIndex >= 0 && voiceIndex < listVoices.length) {
                return await conn.sendFile(m.chat, listVoices[voiceIndex].link, '', m, null, adReply);
            } else {
                return await m.reply('❌ Indeks suara tidak valid. Harap pilih indeks suara yang valid.\nContoh penggunaan: *voice 1 1*');
            }
        } else {
            return await m.reply('❌ Indeks link tidak valid. Harap pilih indeks link yang valid.\nContoh penggunaan: *voice 1 1*');
        }
    }

    // Check if the first argument is 'v2'
    if (args.length === 1 && args[0].toLowerCase() === 'v2') {
        // Fetch the list of voices from voiceV2 and return the message
        const voices = await voiceV2();
        const message = voices.length === 0 ? '❓ Daftar suara kosong.' : `🔊 *Daftar Suara dari voiceV2():*\n${voices.map((voice, index) => `*${index + 1}.* ${voice.text}`).join('\n')}`;
        return await m.reply(message);
    }

    // Check if the first argument is 'v2' and the second argument is a number
    if (args.length === 2 && args[0].toLowerCase() === 'v2' && /^\d+$/.test(args[1])) {
        // Fetch the list of voices from voiceV2 and return the message
        const voiceIndex = parseInt(args[1], 10) - 1;
        const voices = await voiceV2();
        if (voiceIndex >= 0 && voiceIndex < voices.length) {
            return await conn.sendFile(m.chat, voices[voiceIndex].link, '', m, null, adReply);
        } else {
            return await m.reply('❌ Indeks suara tidak valid. Harap pilih indeks suara yang valid.\nContoh penggunaan: *voice v2 1*');
        }
    }

    // Check if the first argument is 'v3' and the second argument is a valid voice
    if (args[0].toLowerCase() === 'v3' && args[1]) {
        // Return the sound link for the specified voice
        const voiceV3Sounds = {
            'ara': 'https://andgyk.is-a.dev/anime-soundboard/audio/ara-ara.mp3',
            'ganbare': 'https://andgyk.is-a.dev/anime-soundboard/audio/ganbare-ganbare-senpai.mp3',
            'konichiwa': 'https://andgyk.is-a.dev/anime-soundboard/audio/hashira-konichiwa.mp3',
            'nani': 'https://andgyk.is-a.dev/anime-soundboard/audio/nani.mp3',
            'rikka': 'https://andgyk.is-a.
