import uploadImage from '../../lib/uploadImage.js';
import {
    Sticker
} from 'wa-sticker-formatter';

const createSticker = async (img, url, authorName, quality) => {
    const stickerMetadata = {
        type: 'full',
        author: authorName,
        quality,
    };
    return (new Sticker(img || url, stickerMetadata)).toBuffer();
}

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    const name = await conn.getName(who);
    const q = m.quoted ? m.quoted : m;
    const mime = q.msg?.mimetype || q.mediaType || '';

    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        let img;
        try {
            img = await q.download();
        } catch (e) {
            m.reply('Gagal mendownload gambar');
            return;
        }

        let uploadResult;
        try {
            uploadResult = await uploadImage(img);
        } catch (e) {
            m.reply('Gagal mengunggah gambar');
            return;
        }

        m.reply('Tunggu sebentar...');

        let sticker;
        try {
            const someResponse = await global.API('https://some-random-api.com', '/canvas/triggered', {
                avatar: uploadResult,
            });
            if (someResponse.status) {
                sticker = await createSticker(false, someResponse.result, name, 60);
            } else {
                const dhamResponse = await global.API('https://api.dhamzxploit.my.id/api/canvas/trigger', {
                    url: uploadResult,
                });
                if (dhamResponse.status) {
                    sticker = await createSticker(false, dhamResponse.result, name, 60);
                } else {
                    m.reply('Gagal membuat stiker triggered');
                    return;
                }
            }
        } catch (error) {
            m.reply('Terjadi kesalahan saat membuat stiker triggered');
            return;
        }

        conn.sendMessage(m.chat, {
            sticker: {
                url: sticker,
            },
        }, 'stickerMessage', {
            quoted: m,
        });
    } else {
        m.reply(`Kirim gambar dengan caption \`${usedPrefix + command}\` atau tag gambar yang sudah dikirim`);
    }
};

handler.menu = ['trigger'];
handler.tags = ['search'];
handler.command = /^(trigger
