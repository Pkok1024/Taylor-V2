import fetch from "node-fetch";
import {
    addExif
} from "../../lib/sticker.js";
import {
    Sticker,
    StickerTypes
} from "wa-sticker-formatter";
import {
    sticker
} from "../../lib/sticker.js";
import got from "got";
import cheerio from "cheerio";
import emojiRegex from "emoji-regex";

const isUrl = (text) => text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'));

const createSticker = async (img, url, packName, authorName, quality) => {
    try {
        let stickerMetadata = {
            type: 'full',
            pack: packName,
            author: authorName,
            quality
        }
        return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
    } catch (error) {
        console.error('Error:', error);
    }
}

const mp4ToWebp = async (file, stickerMetadata) => {
    try {
        if (stickerMetadata) {
            if (!stickerMetadata.pack) stickerMetadata.pack = '‎'
            if (!stickerMetadata.author) stickerMetadata.author = '‎'
            if (!stickerMetadata.crop) stickerMetadata.crop = false
        } else if (!stickerMetadata) {
            stickerMetadata = {
                pack: '‎',
                author: '‎',
                crop: false
            }
        }
        let getBase64 = file.toString('base64')
        const Format = {
            file: `data:video/mp4;base64,${getBase64}`,
            processOptions: {
                crop: stickerMetadata?.crop,
                startTime: '00:00:00.0',
                endTime: '00:00:7.0',
                loop: 0
            },
            stickerMetadata: {
                ...stickerMetadata
            },
            sessionInfo: {
                WA_VERSION: '2.2106.5',
                PAGE_UA: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
                WA_AUTOMATE_VERSION: '3.6.10 UPDATE AVAILABLE: 3.6.11',
                BROWSER_VERSION: 'HeadlessChrome/88.0.4324.190',
                OS: 'Windows Server 2016',
                START_TS: 1614310326309,
                NUM: '6247',
                LAUNCH_TIME_MS: 7934,
                PHONE_VERSION: '2.20.205.16'
            },
            config: {
                sessionId: 'session',
                headless: true,
                qrTimeout: 20,
                authTimeout: 0,
                cacheEnabled: false,
                useChrome: true,
                killProcessOnBrowserClose: true,
                throwErrorOnTosBlock: false,
                chromiumArgs: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--aggressive-cache-discard',
                    '--disable-cache',
                    '--disable-application-cache',
                    '--disable-offline-load-stale-cache',
                    '--disk-cache-size=0'
                ],
                executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
                skipBrokenMethodsCheck: true,
                stickerServerEndpoint: true
            }
        }
        const res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
            method: 'post',
            headers: {
                Accept: 'application/json, text/plain, /',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(Format)
        })
        return Buffer.from((await res.text()).split(';base64,')[1], 'base64')
    } catch (error) {
        console.error('Error:', error);
    }
}

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let stiker = false;
    try {
        const packnames = args[0];
        const authors = args[1] || '';
        let q = m.quoted ? m.quoted : m;
        let mime = q.mtype || '';
        await m.reply(wait);
        if (/stickerMessage/g.test(mime)) {
            const img = await q.download();
            stiker = await addExif(img, packnames || packname, authors || m.name);
        } else if (/imageMessage/g.test(mime)) {
            const img = await q.download();
            stiker = await createSticker(img, false, packnames || packname, authors || m.name);
        } else if (/videoMessage/g.test(mime)) {
            if (q.msg.seconds > 11) return m.reply("Maksimal video durasi 10 detik!");
            const
