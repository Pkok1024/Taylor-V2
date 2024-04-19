import { Search } from '../../lib/tools/search-animewall.js';

const searchEngines = {
  'e621': 'e621',
  'gelbooru': 'gelbooru',
  'rule34': 'rule34',
  'danbooru': 'danbooru',
  'konachan': 'konachan',
  'konachan18': 'konachan18',
  'hypnohub': 'hypnohub',
  'xbooru': 'xbooru',
  'realbooru': 'realbooru',
  'furrybooru': 'furrybooru'
};

const handler = async (m, { text, command }) => {
  if (!text) throw 'Masukkan kueri';
  try {
    const engine = searchEngines[command];
    if (!engine) throw `Engine ${command} not supported`;
    const result = new Search(engine);
    const output = await result.search(text);
    await m.reply(JSON.stringify(output, null, 4));
  } catch (error) {
    await m.reply(error);
  }
};

handler.tags = ['tools'];
handler.command = Object.keys(searchEngines);

export default handler;
