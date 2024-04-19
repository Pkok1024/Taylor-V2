let handler = async (m, { conn, reply }) => {
    if (!conn || !conn.tebakemoji || !reply || !m || !m.chat || !m.sender) throw new Error('Invalid or missing properties');
    let id = m.chat;
    if (!(id in conn.tebakemoji)) throw new Error('Chat ID not found in tebakemoji object');
    let json = conn.tebakemoji[id][1];
    if (!json || !json.unicodeName || typeof json.unicodeName !== 'string' || json.unicodeName.length === 0) throw new Error('JSON object or unicodeName property is invalid');
    let unicodeName = json.unicodeName.replace(/[AIUEOaiueo]/ig, '_');
    reply(m.chat, `\`\`\`${unicodeName}\`\`\``, m);
}
handler.command = /^hemo$/i;
handler.limit = true;
