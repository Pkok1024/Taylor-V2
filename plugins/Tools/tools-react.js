// This function handles the 'react' command, which allows users to add a reaction emoji to a message.
let handler = async (m, {
    conn, // The Bot's connection object.
    usedPrefix: _p, // The prefix used in the command.
    args, // An array of arguments passed in the command.
    text, // The text content of the message.
    usedPrefix // The prefix used in the command.
}) => {
    try {
        // Check if the user has quoted a message to react to.
        if (!m.quoted) throw 'Balas Chatnya !';

        // Check if only one emoji is provided.
        if (text.length > 2) throw 'Cuma Untuk 1 Emoji!';

        // Check if an emoji has been provided.
        if (!text) throw `📍 Contoh Penggunaan :\n${usedPrefix}react 🗿`;

        // Add the reaction to the quoted message.
        await conn.relayMessage(m.chat, {
            reactionMessage: {
                key: {
                    id: m.quoted.id, // The ID of the message to react to.
                    remoteJid: m.chat, // The ID of the chat where the message is located.
                    fromMe: true // Whether the message is from the bot or not.
                },
                text: text // The emoji to add as a reaction.
            }
        }, {
            messageId: m.id // The ID of the message being sent.
        });
    } catch (error) {
        try {
            // If the above method fails, try to add the reaction using the sendReact method.
            await conn.sendReact(m.chat, text, m.quoted.vM.key);
        } catch (error) {
            // If both methods fail, send an error message to the user.
            await conn.reply(m.chat, error, m);
        }
    }
};

// The help message for the command.
handler.help = ['react <emoji>'];
