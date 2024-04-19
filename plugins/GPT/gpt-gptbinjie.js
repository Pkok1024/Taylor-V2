import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let text;
  if (args.length) {
    text = args.slice(0).join(' ');
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    return m.reply('Input Teks');
  }

  await m.reply(global.wait);

  try {
    const result = await generate(text);
    await m.reply(result);
  } catch (error) {
    console.error(error);
    await m.reply(global.eror);
  }
};

handler.help = ['gptbinjie'];
handler.tags = ['gpt'];
handler.command = /^(gptbinjie)$/i;

export default handler;

const generate = async (query) => {
  const BinjieBaseURL = 'https://api.binjie.fun/api/generateStream';

  try {
    const response = await axios.post(BinjieBaseURL, {
      prompt: query,
      system: 'Hello!',
      withoutContext: true,
      stream: false,
    }, {
      headers: {
        origin: 'https://chat.jinshutuan.com',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};
