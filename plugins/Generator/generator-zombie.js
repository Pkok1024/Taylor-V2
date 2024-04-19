import fetch from 'node-fetch';
import {
    FormData,
    Blob
} from 'formdata-node';
import {
    fileTypeFromBuffer
} from 'file-type';

const ToZombi = async (imageBuffer) => {
    try {
        const {
            ext,
            mime
        } = await fileTypeFromBuffer(imageBuffer) || {};
        if (!ext || !mime) {
            throw new Error('Invalid image format');
        }
        const form = new FormData();
        const blob = new Blob([imageBuffer.toArrayBuffer()], {
            type: mime
        });
        form.append('image', blob, `image.${ext}`);

        const response = await fetch("https://deepgrave-image-processor-no7pxf7mmq-uc.a.run.app/transform_in_place", {
            method: 'POST',
            body: form,
        });

        if (!response.ok) {
            throw new Error("Request failed with status code " + response.status);
        }

        const base64Data = await response.text();

        // Convert base64 to image buffer and return it
        return Buffer.from(base64Data, 'base64');
    } catch (error) {
        console.error(error);
        return null;
    }
}

const handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args,
    isQuotedSticker,
    quoted,
}) => {
    if (command.toLowerCase() === 'jadizombie') {
        if (isQuotedSticker) {
            throw 'Balas foto, bukan sticker!';
        }

        let media;
        if (m.quoted && m.quoted.mimetype && m.quoted.mimetype.startsWith('image')) {
            media = await m.quoted.download();
        } else if (m.msg && m.msg.image && m.msg.image.startsWith('data:image')) {
            media = Buffer.from(m.msg.image.split(',')[1], 'base64');
        } else {
            throw 'Tidak ada media yang ditemukan';
        }

        const result = await ToZombi(media);

        if (!result) {
            throw 'Terjadi kesalahan saat mengonversi gambar ke zombie.';
        }

        const tag = `@${m.sender.split('@')[0]}`;

        return conn.sendMessage(m.chat, {
            image: result,
            caption: `Nih effect *photo-to-zombie* nya\nRequest by: ${tag}`,
            mentions: [m.sender]
        }, {
            quoted: m
        });
    }
}

handler.help = ["jadizombie"].map(v => v + " (Balas foto)");
handler.tags = ["tools"];
handler.command = /^(jad
