import fetch from 'node-fetch';
import { mime } from 'mime-types';

export async function before(m) {
  const regex = /(https?:\/\/(?:www\.)?instagram\.[a-z\.]{2,6}\/[\w\-\.]+(\/[^\s]*)?)/g;
  const matches = m.text.trim().match(regex);
  const chat = global.db.data.chats[m.chat];

  if (!matches || !matches[0] || chat.autodlInstagram !== true) return;

  await m.reply(global.wait);

  try {
    const res = await fetch(`https://vihangayt.me/download/instagram?url=${matches[0]}`);
    const data = await res.json();

    if (data.data && data.data.length > 0) {
      for (const item of data.data) {
        const mediaType = mime.lookup(item.url);
        await m.reply(item.url, mediaType, m);
      }
    } else {
      await m.reply('No media found.');
    }
  } catch (e) {
    console.error(e);
    await m.reply('Error downloading media.');
  }
}

export const disabled = false;
