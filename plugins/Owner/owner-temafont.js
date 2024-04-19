import {
    FontList,
    FontListV2
} from "../../lib/fancy-text.js";

// This variable will store the current font theme for the connection
conn.temafont = conn.temafont || null;

const handler = async (m, {
    conn,
    command,
    text
}) => {
    // Check if the text input is a valid number for the theme index
    if (text) {
        const themeIndex = parseInt(text);

        if (isNaN(themeIndex)) {
            // If the input is not a valid number, get the list of font themes
            const fontList = await getFontList();
            // Send a message with the list of font themes to the user
            await conn.sendMessage(m.chat, {
                text: `Input tidak valid. Silakan pilih tema dari daftar berikut:\n${fontList.map((v, i) => `*${i + 1}.* ${v.text} - ${v.name}`).join('\n')}`
            }, {
                quoted: m
            });
            return;
        }

        // Set the current font theme for the connection
        conn.temafont = themeIndex === 0 ? null : themeIndex;
        // Send a success message to the user
        await conn.reply(m.chat, `Tema berhasil diatur\n${themeIndex}`, m);
    } else {
        // If no text input is provided, get the list of font themes
        const fontList = await getFontList();
        // Send a message with the list of font themes to the user
        await conn.sendMessage(m.chat, {
            text: `Input tidak valid. Silakan pilih tema dari daftar berikut:\n${fontList.map((v, i) => `*${i + 1}.* ${v.text} - ${v.name}`).join('\n')}`
        }, {
            quoted: m
        });
        return;
    }
};

// Document the available commands for this handler
handler.help = ['temafont'];
handler.tags = ['owner'];
handler.command = /^(temafont)$/i;
handler.owner = true;

// Export the handler for use in other modules
export default handler;

// This function gets the list of font themes from the FontList or FontListV2 modules
const getFontList = async () => {
    try {
        // Try to get the list of font themes from FontListV2
