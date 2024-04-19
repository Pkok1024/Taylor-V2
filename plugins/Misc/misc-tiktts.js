import {
    tiktokTts,
    ttsModel
} from '../../lib/scraper/scraper-toolv2.js';

const helpMessage = `Input query!\n*Example:*\n${usedPrefix}tiktts [nomor]|[query]\n\n*Pilih angka yg ada*\n${data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n")}`

const handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    const data = await ttsModel();

    const [urutan, tema] = text.split("|");

    if (!tema) return m.reply(helpMessage);

    await m.reply(wait);

    try {
        if (!urutan) throw new Error(helpMessage);

        if (isNaN(urutan)) throw new Error(helpMessage);

        if (urutan > data.length) throw new Error(helpMessage);

        const { id } = data[urutan - 1];
        const res = await tiktokTts(tema, id);

        if (res) {
            const base64Data = Buffer.from(res.data, 'base64');
            await conn.sendMessage(m.chat, {
                audio: base64Data,
                mimetype: 'audio/mp4',
                ptt: true,
                waveform: [100, 0, 100, 0, 100, 0, 100]
            }, {
                quoted: m
            });
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (e) {
        await m.reply(eror);
    }
}

handler.help = ["tiktts *[nomor]|[query]*"]
handler.tags = ["ai"]
handler.command = /^(tiktts)$/i

export default handler;
