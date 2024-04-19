import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { MimetypeMap } from 'handle-media-type';

const lister = [
  'google',
  'unsplash',
];

const handler = async (m, { conn, args, usedPrefix, text, command }) => {
  const [feature, ...inputs] = text.split('|');

  if (!lister.includes(feature)) {
    return m.reply(`*Example:*\n.kapwing ${command} google|cars\n\n*Pilih type yg ada:*\n${lister.map((v, index) => `  ○ ${v}`).join('\n')}`);
  }

  if (inputs.length === 0) {
    return m.reply(`Input query link\nExample: .kapwing ${command} google|cars`);
  }

  try {
    const result = await getImageResults(inputs.join(' '));
    const output = Random(result[feature]);

    await conn.sendFile(m.chat, output.url, output.name, null, m, { mimetype: MimetypeMap.getMimeType(output.url) });
  } catch (e) {
    console.error(e);
    await m.reply(eror);
  }
};

handler.help = ['kapwing type query'];
handler.tags = ['internet'];
handler.command = /^(kapwing)$/i;
export default handler;

async function getImageResults(query) {
  const response = await fetch('https://us-central1-kapwing-181323.cloudfunctions.net/image_search', {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'content-type': 'application/json',
      referer: 'https://www.kapwing.com/studio/editor/overlay/search',
      origin: 'https://www.kapwing.com',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
    },
  });

  const json = await response.json();

  return json;
}

function Random(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}


npm install handle-media-type
