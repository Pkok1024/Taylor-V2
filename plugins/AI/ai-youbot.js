// .env
API_KEY=global

// bot.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const getyoubotResponse = async (q, u) => {
  try {
    const response = await fetch(`https://api.azz.biz.id/api/youbot?q=${q}&key=${process.env.API_KEY}`);
    const data = await response.json();
    return data.hasil;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handler = async (m, {
  text
}) => {
  if (typeof text !== 'string') throw 'Contoh: .youbot Pesan yang ingin Anda sampaikan kepada asisten AI';

  m.reply(wait);

  try {
    const response = await getyoubotResponse(text, m.name);

    if (response !== null && response !== undefined) {
      m.reply(response);
    } else {
      m.reply('Tidak ada respons dari asisten AI.');
    }
  } catch (error) {
    console.error('Error:', error);

    if (eror !== undefined) {
      m.reply(eror);
    } else {
      m.reply('Ter
