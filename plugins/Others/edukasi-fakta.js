import fetch from "node-fetch"

const APIs = [
  { name: "lolhuman", url: "/api/random/faktaunik" },
  { name: "zenz", url: "/randomtext/faktaunik" },
];

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    for (const api of APIs) {
      const res = await fetch(global.API(api.name, api.url, {}, "apikey"));
      const json = await res.json();

      if (json.result) {
        await conn.reply(m.chat, `*Taukah kamu ternyata*\n${json.result}\n\n*Powered by:* ${api.name}`, m);
        return;
      }
    }
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, "Maaf, ada kesalahan saat mengambil data fakta unik.", m);
  }
};

handler.help = ['fakta'];
handler.tags = ['edukasi'];
handler.command = /^(fakta|faktaunik)$/i;
export default handler;
