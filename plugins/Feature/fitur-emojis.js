import fetch from 'node-fetch';
import cheerio from 'cheerio';
import {
    sticker
} from '../../lib/sticker.js';

const emojiGraph = async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const emojiData = [];

    $('.emoji__title').each((index, element) => {
        const emojiName = $(element).find('.emoji').text();
        const emojiLink = $(element).siblings('.emoji__copy').find('.emoji').text();
        const emojiDescription = $(element).siblings('p').text();

        const vendorData = [];
        $(element).siblings('.emoji__div__tablet').find('.block__emoji').each((i, vendorElement) => {
            const vendorName = $(vendorElement).find('a').text();
            const vendorLink = $(vendorElement).find('a').attr('href');
            const vendorImage = $(vendorElement).find('img').attr('data-src');
            vendorData.push({
                name: vendorName,
                link: 'https://emojigraph.org' + vendorLink,
                image: 'https://emojigraph.org' + vendorImage
            });
        });

        emojiData.push({
            name: emojiName,
            link: emojiLink,
            description: emojiDescription,
            vendors: vendorData
        });
    });

    return emojiData;
}

const searchEmoji = async (q) => {
    try {
        const response = await fetch(`https://emojigraph.org/id/search/?q=${q}&searchLang=id`);
        const html = await response.text();
        const $ = cheerio.load(html);

        return $('#search__first .s__first__ul a').map((index, element) => 'https://emojigraph.org' + $(element).attr('href')).get();
    } catch (error) {
        console.error('Error:', error);
    }
}

const emojiPedia = async (emoji) => {
    const response = await fetch(`https://emojipedia.org/${encodeURI(emoji)}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    return $('section.vendor-list > ul > li').map((_, v) => ({
        vendor: $('h2 a', v).text(),
        url: `https://emojipedia.org/${$('h2 a', v).attr('href').replace(/^\//, '')}`,
        image: $('.vendor-image img', v).attr('src').replace('/120/', '/240/'),
        version: $('.vendor-rollout li', v).map((_, ve) => ({
            name: $('.version-name a', ve).text(),
            url: `https://emojipedia.org/${$('.version-name a', ve).attr('href').replace(/^\//, '')}`,
            image: $('.vendor-image img', ve).attr('data-src').replace('/60/', '/240/'),
        })).get(),
    })).get();
}

const handler = async (m, {
    args,
    usedPrefix,
    command
}) => {

    if (!args[0]) return m.reply('Please enter an *emoji* or a valid command.');

    try {
        const url = await searchEmoji(args[0])
        const res = await emojiGraph(url[0])
        const emojiData = res[0].vendors
        if (!emojiData.length) return m.reply('Emoji not found or invalid input. Please try again.');

        if (!args[1]) {
            const vendorsList = emojiData.map((data, index) => `*${index + 1}.* ${data.name}`);
            return m.reply(`Vendors list for *${args[0]}*:\n\n${vendorsList.join('\n')}\n\nExample: *${usedPrefix + command}* [emoji] [vendor]`);
        }

        const vendorIndex = parseInt(args[1]) - 1;
        if (isNaN(vendorIndex) || vendorIndex < 0 || vendorIndex >= emojiData.length) return m.reply(`Invalid vendor index. Please provide a valid number from 1 to ${emojiData.length}.`);

        const vendorData = emojiData[vendorIndex];
        m.reply(`Emoji information for *${args[0]}* (${vendorData.name}):\n\nURL: ${vendorData.link}\nImage: ${vendorData.image}`);
        return m.reply(await sticker(false, vendorData.image, packname, m.name));
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return m.reply('Error while fetching emoji data.');
    }
};

handler.help = ['emoji'];
handler.tags = ['sticker'];
handler.command = /^(emo(jis|(ji)?)|se?moji)$/i;
export default handler;
