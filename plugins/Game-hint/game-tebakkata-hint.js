let handler = async (m, { conn }) => {
  conn.tebakkata = conn.tebakkata || {};
  let id = m.chat;
  if (typeof id !== 'string') throw new Error('Invalid chat ID');
  if (!(id in conn.tebakkata)) throw new Error('Game not found');
  let json = conn.tebakkata[id];
  if (!Array.isArray(json)) throw new Error('Invalid game data');
  json = json[1];
  if (typeof json.jawaban !== 'string') throw new Error('Invalid answer data');
  let answer = json.jawaban.replace(/[AIUEOaiueo]/ig, '_');
  if (answer.length === 0) throw new Error('Empty answer');
  await conn.reply(m.chat, '```' + answer + '```', m);
}
handler.command = /^hkat$/i;
handler.limit = true;

module.exports = handler;
