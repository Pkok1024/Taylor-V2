import pkg from '@whiskeysockets/baileys';

// Import the WA_DEFAULT_EPHEMERAL constant from the package
const {
    WA_DEFAULT_EPHEMERAL
} = pkg;

// Define the options object with various ephemeral message duration options
const options = {
    'on': WA_DEFAULT_EPHEMERAL, // WA Default
    'off': 0, // disable
    '1d': 86400, // 1 hari
    '7d': 604800, // 7 hari
    '90d': 7776000 // 90 hari
};

// Define the handler function for the 'disappearing' command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    // Check if the number of arguments is correct
    if (args.length !== 2) {
        // Return a usage message if the number of arguments is incorrect
        const usage = `Usage: *${usedPrefix + command} Number <options>*\nExample: *${usedPrefix + command} 628383770933 1d*\n\n[ List Options ]\n⭔ *on* ( WA Default )\n⭔ *off* ( disable )\n⭔ *1d* ( 1 hari )\n⭔ *7d* ( 7 hari )\n⭔ *90d* ( 90 hari )`;
        return m.reply(usage);
    }

    // Format the JID (WhatsApp ID) of the target user
    let jid = formatJid(args[0]);

    // Get the user data for the target user
    let data = (await conn.onWhatsApp(jid))[0] || {};

    // Check if the user exists
    if (!data.exists) throw 'Nomor tidak terdaftar di WhatsApp!';

    // Convert the second argument to lowercase
    const lowercaseText = args[1].toLowerCase();

    // Check if the selected option is valid
    const selectedOption = options[lowercaseText];
    if (selectedOption !== undefined) {
        // Send the ephemeral message with the selected duration
        await conn.sendMessage(jid, {
            disappearingMessagesInChat: selectedOption
        });

        // Construct the response message based on the selected option
        const response = selectedOption === 0 ? 'dimatikan' : selectedOption === WA_DEFAULT_EPHEMERAL ? 'diaktifkan' : `disetel untuk *${lowercaseText}*`;

        // Return the response message
        return m.reply(`*Ephemeral messages* berhasil ${response}.`);
    } else {
        // Return the usage message if the selected option is invalid
        const usage = `Usage: *${usedPrefix + command} Number <options>*\nExample: *${usedPrefix + command} 628383770933 1d*\n\n[ List Options ]\n⭔ *on* ( WA Default )\n⭔ *off* ( disable )\n⭔ *1d* ( 1 hari )\n⭔ *7d* ( 7 hari )\n⭔ *90d* ( 90 hari )`;
        return m.reply(usage);
    }
};

//
