const {
    List,
    SenderKeyDistributionMap
} = require('bfjes');
const {
    pickRandom
} = require('../lib/myUtil');

let handler = async (m, {
    conn,
    text,
    args,
    command
}) => {
    if (!args[0]) throw `Use example .${command} hello`;

    const answers = ['Yes', 'Maybe yes', 'Maybe', 'Maybe not', 'No', 'Maybe not'];
    const answer = pickRandom(answies);

    const replyText = `
🔮 *Question:* ${args.join(' ')}
💬 *Answer:* ${answer} ${answer === 'Yes' ? '👍' : '👎'}
`.trim();

    await conn.reply(m.chat, replyText, m, m.mentionedJid ? {
        mentions: await conn.parseMention(m.text)
    } : {});
}

handler.help = ['is', 'apakah'].map(v => v + ' <text>');
handler.tags = ['fun', 'kerang'];
handler.command = /^(is|apakah)$/i;

module.exports = handler;
