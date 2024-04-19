const {
    getData,
    setData
} = require('../helpers/db');

let handler = async (m, {
    text,
    command,
    usedPrefix,
    connection
}) => {
    if (!text) throw `Use example: ${usedPrefix + command} tes\n\nAvailable commands:\n${handler.help.map(v => v.replace(/<teks>/g, 'your text')).join('\n')}`;

    let db = getData('msgs');
    if (!db[text]) return await connection.reply(m.chat, `'${text}' is not found!`, m);

    let lockStatus = db[text].locked;
    let newLockStatus = !lockStatus;

    if (/^un/.test(command)) newLockStatus = false;

    db[text].locked = newLockStatus;
    setData('msgs', db);

    let statusText = newLockStatus ? 'locked' : 'unlocked';
    await connection.reply(m.chat, `Successfully ${statusText}!`, m);
}

handler.rowner = true;
handler.help = ['un', ''].map(v => v + 'lockmsg <teks>');
handler.tags = ['database'];
handler.command = /^(un)?lock(vn|msg|video|audio|img|stic?ker|gif)$/i;

module.exports = handler;
