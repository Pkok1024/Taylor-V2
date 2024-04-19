let handler = async (m, { conn }) => {
  try {
    conn.tebaksurah = conn.tebaksurah || {};
    let id = m.chat;
    if (!(id in conn.tebaksurah)) throw false;
    let json = conn.tebaksurah[id][1];
    if (!json || !json.surah || !json.surah.englishName) throw false;
    let result = json.surah.englishName.replace(/[AIUEOaiueo]/ig, '_');
    if (!result) throw false;
    await conn.reply(m.chat, '```' + result + '```', m);
  } catch (e) {
    console.error(e);
    throw false;
  }
}
handler.command = /^hsur$/i;
handler.limit = true;

export default handler;
