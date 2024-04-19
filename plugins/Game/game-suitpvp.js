const timeout = 60000;
const poin = 500;
const poin_lose = -100;

const startSuit = async (conn, m, p, poin, poin_lose) => {
  const id = `suit_${new Date() * 1}`;
  const caption = `
*SUIT PvP*

@${m.sender.split`@`[0]} menantang @${p.split`@`[0]} untuk bermain suit.

Silahkan @${p.split`@`[0]}.
`.trim();
  const footer = `Ketik "terima/ok/gas" untuk memulai suit\nKetik "tolak/gabisa/nanti" untuk menolak.`;
  const mention = [m.sender, ...(await conn.parseMention(caption))];
  const chat = await conn.reply(m.chat, caption + footer, m, {
    mentions: mention,
  });
  return {
    id,
    chat,
    p,
    p2: m.sender,
    status: "wait",
    waktu: setTimeout(() => {
      if (conn.suit[id]) conn.reply(m.chat, `_Waktu suit habis_`, m);
      delete conn.suit[id];
    }, timeout),
    poin,
    poin_lose,
    timeout,
  };
};

const handler = async (m, { conn, usedPrefix }) => {
  const who = m.mentionedJid[0] || m.sender;
  conn.suit = conn.suit || {};
  const room = Object.values(conn.suit).find(
    (room) =>
      room.id.startsWith("suit") && [room.p, room.p2].includes(m.sender)
  );
  if (room) throw "Selesaikan suit sebelumnya terlebih dahulu.";
  if (!who)
    return m.reply(
      `_Siapa yang ingin kamu tantang?_\nTag orangnya.. Contoh\n\n${usedPrefix}suit @${conn.user.jid.split("@")[0]}`,
      m.chat,
      {
        contextInfo: {
          mentionedJid: [conn.user.jid],
        },
      }
    );
  const room2 = Object.values(conn.suit).find(
    (room) => room.id.startsWith("suit") && [room.p, room.p2].includes(who)
  );
  if (room2) throw `Orang yang kamu tantang sedang bermain suit bersama orang lain :(`;
  return startSuit(conn, m, who, poin, poin_lose);
};
handler.tags = ["game"];
handler.
