/* Recode By Wudysoft */
import fetch from 'node-fetch';

const handler = async ({
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    const {
        conn: connGlobal,
        message: {
            key
        }
    } = conn;

    await conn.sendMessage(m.chat, {
        react: {
            text: '⏳',
            key: m.key,
        }
    })

    const anime = [
        "9anime",
        "animefox",
        "animepahe",
        "bilibili",
        "crunchyroll",
        "enime",
        "gogoanime",
        "zoro"
    ];

    const books = ["libgen"];

    const comics = ["getComics"];

    const lightnovels = ["readlightnovels"];

    const manga = [
        "managreader",
        "mangadex",
        "mangahere",
        "mangakakalot",
        "mangapark",
        "mangapill",
        "mangasee123"
    ];

    const meta = [
        "anilist-manga",
        "anilist",
        "mal",
        "tmdb"
    ];

    const movies = [
        "dramacool",
        "flixhq",
        "viewasian"
    ];

    const urut = text.split`|`;
    const one = urut[0];
    const two = urut[1];
    const three = urut[2];

    if (!args[0]) {
        throw `Usage: ${usedPrefix}${command} anime|books|comics|lightnovels|manga|meta|movies <query>\nExample: ${usedPrefix}${command} anime naruto`;
    }

    if (args[0] === 'anime') {
        const listSections = [];

        for (const [index, value] of anime.entries()) {
            const url = `https://api.consumet.org/anime/${value}/${one}`;
            listSections.push([`Model [ ${index + 1} ]`, [
                [value, usedPrefix + command + " consumetget " + url, "➥"]
            ]]);
        }

        return conn.sendList(m.chat, htki + " 📺 Models 🔎 " + htka, `⚡ Silakan pilih Model di tombol di bawah...\n*Teks yang anda kirim:* ${text}\n\nKetik ulang *${usedPrefix + command}* teks anda untuk mengubah teks lagi`, author, "☂️ M O D E L ☂️", listSections, m);
    }

    // ... repeat for other if statements

    if (args[0] === 'consumetget') {
        if (!args[1]) {
            throw 'Please provide a URL for the consumetget command.';
        }

        const jso = await fetch(args[1]);
        const res = await jso.json();

        if (res.error) {
            throw res.error;
        }

        const sul = Object.values(res.results[0] ? res.results[0] : res.results).join('\r\n• ').replace('[object Object]', '');
        throw `*Result :*\n\n• ${sul}\n\n${author}`;
    }
}

handler.help = ['consumet'].map(v => v + ' query');
handler.tags = ['tools'];
handler.command = /^consumet$/i;
handler.limit = true;
export default handler;
