import cheerio from 'cheerio';
import fetch from 'node-fetch';

const baseUrl = 'https://shortstatusvideos.com';
const url2 = 'https://mobstatus.com/anime-whatsapp-status-video/';

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    await m.reply(wait);
    if (!text) return m.reply('input number');
    const number = parseInt(text);
    if (number === 1) {
        try {
            const resl = await animeVideo();
            const cap = `📝 *Title:* ${resl.title}`;
            await conn.sendFile(m.chat, resl.source, "", cap, m);
        } catch (e) {
            await m.reply(eror);
        }
    } else if (number === 2) {
        try {
            const resl = await animeVideo2();
            const cap = `📝 *Title:* ${resl.title}`;
            await conn.sendFile(m.chat, resl.source, "", cap, m);
        } catch (e) {
            await m.reply(eror);
        }
    } else {
        m.reply('invalid number');
    }
}

handler.help = ["animevideo"];
handler.tags = ["internet"];
handler.command = /^(animevideo)$/i;

export default handler;

const animeVideo = async () => {
    const url = baseUrl + '/anime-video-status-download/';
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const videos = [];

    $('a.mks_button.mks_button_small.squared').each((index, element) => {
        const href = $(element).attr('href');
        const title = $(element).closest('p').prevAll('p').find('strong').text();
        videos.push({
            title,
            source: href
        });
    });

    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];

    return randomVideo;
}

const animeVideo2 = async () => {
    const response = await fetch(url2);
    const html = await response.text();
    const $ = cheerio.load(html);

    const videos = [];

    const title = $('strong').text();

    $('a.mb-button.mb-style-glass.mb-size-tiny.mb-corners-pill.mb-text-style-heavy').each((index, element) => {
        const href = $(element).attr('href');
        videos.push({
            title,
            source: href
        });
    });

    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];

    return randomVideo;
}
