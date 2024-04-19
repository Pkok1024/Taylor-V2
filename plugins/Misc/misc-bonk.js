import jimp from 'jimp';
import { getProfilePicture } from '@adiwajshing/baileys';

const handler = async (m, { conn, args }) => {
  try {
    // Get the first mentioned user or the sender if not mentioned
    const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

    // Load the base image
    const baseImage = await jimp.read('https://i.imgur.com/nav6WWX.png');

    // Load the user's profile picture
    const avatar = await getProfilePicture(conn, who);
    const avatarImage = await jimp.read(avatar);
    const resizedAvatar = avatarImage.resize(128, 128);

    // Composite the avatar onto the base image
    const compositedImage = await baseImage.composite(resizedAvatar, 120, 90, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1,
    });

    // Send the resulting image
    await conn.sendMessage(m.chat, { image: await compositedImage.getBufferAsync('image/png') }, { quoted: m });
  } catch (err) {
    console.error(err);
    await conn.reply(m.chat, 'An error occurred while processing the image.', m);
  }
};

handler.command = /^(bonk)$/i;

export default handler;
