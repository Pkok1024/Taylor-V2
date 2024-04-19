import fetch from "node-fetch";
import { msToTime, formatSize } from "./functions.js"; // import helper functions from a separate file

const handler = async (m, { conn, isOwner, usedPrefix, command, text }) => {
  conn.dropmail = conn.dropmail || {};
  const id = "dropmail";

  const lister = ["create", "message", "delete"];

  const [feature, ...inputs] = text.split(" ");

  if (!lister.includes(feature))
    return m.reply(
      "*Example:*\n" +
        usedPrefix +
        command +
        " create\n\n*Pilih type yg ada:*\n" +
        lister
          .map((v, index) => "  ○ " + v)
          .join("\n")
    );

  if (lister.includes(feature)) {
    if (feature === "create") {
      try {
        const eml = await random_mail();
        const timeDiff = new Date(eml[2]) - new Date();
        conn.dropmail[id] = [
          await m.reply(
            "*EMAIL:*\n" +
              eml[0] +
              "\n\n" +
              "*ID:*\n" +
              eml[1] +
              "\n\n*Expired:*\n" +
              msToTime(timeDiff) +
              "\n\n_Ketik *" +
              usedPrefix +
              command +
              " message* Untuk mengecek inbox_"
          ),
          eml[0],
          eml[1],
          eml[2],
        ];
      } catch (e) {
        await m.reply("An error occurred."); // replaced eror with a more understandable message
      }
    }

    if (feature === "message") {
      if (!conn.dropmail[id])
        return m.reply(
          "Tidak ada pesan, buat email terlebih dahulu\nKetik *" +
            usedPrefix +
            command +
            " create*"
        );

      try {
        const eml = await get_mails(conn.dropmail[id][2]);
        let teks = eml[0].map((v, index) => {
          return `*EMAIL [ ${index + 1} ]*
*Dari* : ${v.fromAddr}
*Untuk* : ${v.toAddr}

*Pesan* : ${v.text}
*Size* : ${formatSize(v.rawSize)}
*Header* : ${v.headerSubject}
*Download* : ${v.downloadUrl}
   `.trim();
        }).filter(v => v).join("\n\n________________________\n\n");
        await m.reply(teks || "*KOSONG*" + "\n\n_Ketik *" + usedPrefix + command + " delete* Untuk menghapus email_");
      } catch (e) {
        await m.reply("An error occurred."); // replaced eror with a more understandable message
      }
    }

    if (feature === "delete") {
      if (!conn.dropmail[id])
        return m.reply("Tidak ada email yang terpakai");

      try {
        delete conn.dropmail[id];
        await m.reply("Sukses menghapus email");
      } catch (e) {
        await m.reply("An error occurred."); // replaced eror with a more understandable message
      }
    }
  }
};

handler.help = ["dropmail"];
handler.tags = ["misc"];
handler.command = /^(dropmail)$/i;
export default handler;


export function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}

export function formatSize(sizeInBytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (sizeInBytes >= 1024 && index < units.length - 1) {
    sizeInBytes /= 1024;
    index++;
  }

  return sizeInBytes.toFixed(2) + " " + units[index];
}
