import axios from 'axios';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

const batotoAPI = 'https://batotojs.tzurs11.repl.co';
const lister = [
  'search',
  'chapter',
  'pdf'
];

const handler = async (m, {
  conn,
  args,
  usedPrefix,
  text,
  command
}) => {
  const [feature, inputs] = text.split('|');

  if (!lister.includes(feature)) {
    return m.reply("*Example:*\n.batoto search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));
  }

  try {
    if (feature === 'search') {
      if (!inputs) throw new Error('Input query link\nExample: .batoto search|vpn');
      const res = await searchBatoto(inputs);
      const teks = res.results.map((item, index) => {
        return `- *Title:* ${item.title.original}\n- *ID:* ${item.id}\n- *Genre:* ${item.genres.join(', ')}`
      }).filter(v => v).join("\n\n________________________\n\n");
      await m.reply(teks);
    }

    if (feature === 'chapter') {
      if (!inputs) throw new Error('Input query link\nExample: .batoto search|group');
      const res = await getID(inputs);
      const teks = res.chapters.map((item, index) => {
        return `- *Name:* ${item.name}\n- *ID:* ${item.id}`
      }).filter(v => v).join("\n\n________________________\n\n");
      await m.reply(teks);
    }

    if (feature === 'pdf') {
      if (!inputs) throw new Error('Input query link\nExample: .batoto search|group');
      const linkArray = await getLinkArray(inputs);
      const data = await addImagesToPDF(linkArray.pages);
      await conn.sendFile(m.chat, data, inputs, "DONE", m, null, {
        mimetype: 'application/pdf',
        contextInfo: {
          mentionedJid: [m.sender]
        }
      });
    }
  } catch (error) {
    console.error(error);
    await m.reply(error.message || 'An error occurred');
  }
}

handler.help = ["batoto"];
handler.tags = ["internet"];
handler.command = /^(batoto)$/i;

export default handler;

const searchBatoto = async (q) => {
  const response = await axios.get(`${batotoAPI}/searchByKeyword/${q}`);
  return response.data;
};

const getID = async (q) => {
  const response = await axios.get(`${batotoAPI}/getByID/${q}`);
  return response.data;
};

const getLinkArray = async (q) => {
  const response = await axios.get(`${batotoAPI}/getChapterByID/${q}`);
  return response.data;
};

const addImagesToPDF = async (imageLinks) => {
  return new Promise(async (resolve) => {
    const pdf = new PDFDocument();

    for (const link of imageLinks) {
      const imageBuffer = await downloadImage(link);
      if (imageBuffer) {
        const convertedImageBuffer = await convertWebpToPNG(imageBuffer);
        pdf.addPage().image(convertedImageBuffer);
      }
    }

    const buffers = [];
    pdf.on('data', (chunk) => buffers.push(chunk));
    pdf.on('end', () => resolve(Buffer.concat(buffers)));
    pdf.end();
  });
}

const downloadImage = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const imageBuffer = await response.arrayBuffer();
      return Buffer.from(imageBuffer);
    } else {
      console.error(`Error downloading image from ${url}`);
      return null;
    }
  } catch (error) {
    console.error(`Error downloading image from ${url}: ${error.message}`);
    return null;
  }
}

const convertWebpToPNG = async (webpBuffer) => {
  try {
    const pngBuffer = await sharp(webpBuffer).toFormat('png').toBuffer();
    return pngBuffer;
  } catch (error) {
    console.error('Error converting webp to PNG:', error.message);
    return null;
  }
}
