import fetch from "node-fetch";

const wait = "Wait a moment...";
const error = "An error occurred. Please try again.";

async function TranslateCode(code, fromlang, tolang) {
  try {
    if (!code || !fromlang || !tolang) {
      throw new Error("Missing required parameters.");
    }

    const response = await fetch(
      `https://api.yanzbotz.my.id/api/ai/codetranslator?code=${code}&fromlang=${fromlang}&tolang=${tolang}`
    );

    if (!response.ok) {
      throw new Error("Network response was not OK.");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

const handler = {
  async handler(m, { conn, args, usedPrefix, command }) {
    try {
      const text = m.quoted ? m.quoted.text : "";

      if (!text) {
        return m.reply(
          `Reply code yang mau di transform.\n*Example:*\n${usedPrefix}${command} py js`
        );
      }

      await m.reply(wait);

      const fromlang = "python"; // Set the default language to translate from
      const tolang = "
