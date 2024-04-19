import cheerio from 'cheerio';
import fetch from 'node-fetch';

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    const lister = [
        "search",
        "chord"
    ];

    const [feature, ...inputs] = text.split("|");
    if (!lister.includes(feature)) return m.reply("*Example:*\n.gitagram search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));

    if (lister.includes(feature)) {
        if (feature == "search") {
            if (!inputs.length) return m.reply("Input query link\nExample: .gitagram search|hello");
            await m.reply(wait);
            try {
                const res = await searchGitagram(inputs[0]);
                const teks = res.map((item, index) => {
                    return `🔍 *[ RESULT ${item.index} ]*

📰 *Title:* ${item.title || 'Tidak diketahui'}
🔗 *Url:* ${item.link || 'Tidak diketahui'}
`
                }).filter(v => v).join("\n\n________________________\n\n");
                await m.reply(teks);
            } catch (e) {
                await m.reply(eror);
            }
        }

        if (feature == "chord") {
            if (inputs.length < 1) return m.reply("Input query link\nExample: .gitagram chord|link");
            try {
                const item = await chordGitagram(inputs[0]);
                const teks = `🔍 *[ RESULT ]*

📰 *Title:* ${item.title || 'Tidak diketahui'}
🖼️ *Image:* ${item.image || 'Tidak diketahui'}
📅 *Release Date:* ${item.releaseDate || 'Tidak diketahui'}
👤 *Author:* ${item.author || 'Tidak diketahui'}
🎸 *Chord:* ${item.chord || 'Tidak diketahui'}
📝 *Description:* ${item.description || 'Tidak diketahui'}
🔗 *Link:* ${item.link || 'Tidak diketahui'}
`;
                await conn.sendFile(m.chat, item.image || flaaa.getRandom() + command, "", teks, m);

            } catch (e) {
                await m.reply(eror);
            }
        }
    }
}
handler.help = ["gitagram"]
handler.tags = ["internet"]
handler.command = /^(gitagram)$/i
export default handler;

const searchGitagram = async (query) => {
    const url = `https://www.gitagram.com/index.php?s=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const results = [];

    $('.main .section .container .columns .column .panel .table tbody tr').each((index, element) =>
        results.push({
            index: index + 1,
            title: $
