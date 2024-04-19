import { Client as Hercai } from "../../lib/ai/hercai.js";

const hercaiClient = new Hercai();

interface MessageContext {
  m: any;
  usedPrefix: string;
  conn: any;
  text: string;
  args: string[];
}

const sendResponse = (conn: any, m: any, text: string, mentions?: string[]) => {
  conn.sendMessage(m.chat, { text }, { quoted: m, mentions });
};

const handler = async (ctx: MessageContext) => {
  const { m, usedPrefix, conn, text, args } = ctx;

  const input_data = [
    "chatv2",
    "chatbeta",
    "chatv3-beta",
    "imagev1",
    "imagev2",
    "imagev2-beta",
    "imagev3",
    "imagelexica",
    "imageprodia",
  ];

  const [urutan, tema] = text.split("|");
  if (!tema) return sendResponse(conn, m, `Input query!\n*Example:*\n.hercai [nomor]|[query]`);

  await m.reply(wait);
  try {
    const data = input_data.map((item, index) => ({ title: item.replace(/[_-]/g, " ").replace(/\..*/, ""), id: item }));
    if (!urutan)
      return sendResponse(
        conn,
        m,
        `Input query!\n*Example:*\n.hercai [nomor]|[query]\n\n*Pilih angka yg ada*\n` +
          data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n")
      );

    const index = parseInt(urutan, 10) - 1;
    if (isNaN(index) || index < 0 || index >= data.length)
      return sendResponse(
        conn,
        m,
        `Input query!\n*Example:*\n.hercai [nomor]|[query]\n\n*Pilih angka yg ada*\n` +
          data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n")
      );

    const out = data[index].id;

    switch (out) {
      case "chatv2":
      case "chatbeta":
      case "chatv3-beta":
        const questionResult = await hercaiClient.question({
          model: out.slice(-2),
          content: tema,
        });
        sendResponse(conn, m, questionResult.reply, [m.sender]);
        break;

      case "imagev1":
      case "imagev2":
      case "imagev2-beta":
      case "imagev3":
      case "imagelexica":
      case "imageprodia":
        const imageResult = await hercaiClient.drawImage({
          model: out,
          prompt: tema,
        });
        const tag = `@${args[0] ? args[0].split("@")[0] : m.sender.split("@")[0]}`;
        sendResponse(conn, m, null, [m.sender]);
        sendResponse(conn, m, `Nih effect *${out}* nya\nRequest by: ${tag}`, [m.sender]);
        break;
    }
  } catch (e) {
    sendResponse(conn, m, eror);
  }
};

handler.help = ["hercai *[nomor]|[query]*"];
handler.tags = ["ai"];
handler.command = /^(hercai)$/i;
export default handler;
