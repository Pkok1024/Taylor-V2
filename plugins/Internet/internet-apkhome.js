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
        "app"
    ];

    const [feature, ...inputs] = text.split("|");
    if (!lister.includes(feature)) return m.reply("*Example:*\n.apkhome search|vpn\n\n*Pilih type yg ada:*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));

    if (lister.includes(feature)) {
        if (feature === "search") {
            if (!inputs.join("")) return m.reply("Input query link\nExample: .apkhome search|vpn");
            await m.reply(wait);
            try {
                const res = await searchApkhome(inputs.join(" "));
                const teks = res.map((item, index) => {
                    return `🔍 *[ RESULT ${index + 1} ]*

📰 *Title:* ${item.title}
🔗 *Url:* ${item.href}
🖼️ *Thumb:* ${item.imageSrc}
📆 *Edition:* ${item.edition}`
                }).filter(v => v).join("\n\n________________________\n\n");
                await m.reply(teks);
            } catch (e) {
                await m.reply(eror);
            }
        }

        if (feature === "app") {
            if (!inputs.join("")) return m.reply("Input query link\nExample: .apkhome app|link");
            try {
                const resl = await getApkhome(inputs.join(" "));

                const cap = "*Name:* " + resl.downloadLink + "\n" + "*Link:* " + resl.downloadLinkURL + "\n\n" + wait;
                await conn.sendFile(m.chat, resl.ogImageUrl, "", cap, m);
                await conn.sendFile(m.chat, resl.downloadLinkURL, resl.downloadLink, null, m, true, {
                    quoted: m,
                    mimetype: "application/vnd.android.package-archive"
                });
            } catch (e) {
                await m.reply(eror);
            }
        }
    }
}
handler.help = ["apkhome"]
handler.tags = ["internet"]
handler.command = /^(apkhome)$/i
export default handler;

const searchApkhome = async (query) => {
    try {
        const url = `https://apkhome.io/id/?s=${query}`;
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const elements = $('li > dl > a');

        const result = elements.map((index, element) => {
            const anchorElement = $(element);

            const data = {
                href: anchorElement.attr('href'),
                imageSrc: anchorElement.find('.l img').attr('data-cfsrc') || anchorElement.find('.l img').attr('src'),
                title: anchorElement.find('.r .p1').text().trim(),
                edition: anchorElement.find('.r p:last-of-type').text().trim()
            };

            return data;
        }).get();

        return result;
    } catch (error) {
        console.error(error);
    }
}

const getApkhome = async (url) => {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const ogImageUrl = $('meta[property="og:image"]').attr('content');
        const gtBlockElement = $('p.gt-block');

        const data = {
            title: gtBlockElement.find('strong').first().text().trim(),
            description: gtBlockElement.first().text().trim(),
            supportedAndroid: gtBlockElement.filter(':contains("Android yang didukung")').next('br').text().trim(),
            supportedAndroidVersions: gtBlockElement.filter(':contains("Versi Android yang didukung")').next('br').text().trim(),
            ogImageUrl: ogImageUrl,
            downloadLink: $('a[href^="https://dl2.apkhome.io"]').text().trim(),
            downloadLinkURL: $('a[href^="https://dl2.apkhome.io"]').attr('href')
        };

        return data;
    } catch (error) {
        console.error(error);
    }
}
