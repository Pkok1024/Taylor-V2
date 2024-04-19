import fetch from "node-fetch";

const wait = "Waiting for response...";
const error = "An error occurred. Please try again.";

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    const text = args.join(" ") || m.quoted.text;
    if (!text) throw "Input text";

    await m.reply(wait);
    const response = await chatWithGPT(text);
    await m.reply(response);
  } catch (err) {
    console.error(err);
    await m.reply(error);
  }
};

handler.help = ["fastgpt"];
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(fastgpt)$/i;

export default handler;

/**
 * Chat with GPT using the provided text
 * @param {string} text - The text to use for the chat
 * @returns {string} - The response from GPT
 */
const chatWithGPT = async (text) => {
  const generateRandomString = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return result;
  };

  const _iam = generateRandomString(8);

  const response1 = await fetch("https://chat.aidutu.cn/api/cg/chatgpt/user/info?v=1.5", {
    method: "POST",
    headers: {
      "accept": "*/*",
      "referrer": "https://chat.aidutu.cn/",
      "x-iam": _iam,
      "Cookie": `_UHAO={"uid":"160941","school":"","time":1681704243,"ts":"2","name":"chat_q2Ac","head":"/res/head/2ciyuan/24.jpg","term":"201801","sign":"714653d141dac0e7709f31003b8df858"}; _UIP=0e98d94e599ef74c29fb40cb35971810`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      iam: _iam,
    }),
  });

  const data = await response1.json();
  const xtoken = data.data.token;

  const response2 = await fetch("https://chat.aidutu.cn/api/chat-process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://chat.aidutu.cn/",
      "Cookie": `_UHAO={"uid":"160941","school":"","time":1681704243,"ts":"2","name":"chat_q2Ac","head":"/res/head/2ciyuan/24.jpg","term":"201801","sign":"714653d141dac0e7709f31003b8df858"}; _UIP=0e98d94e599ef74c29fb40cb35971810`,
      "accept": "application.json, text/plain, */*",
      "x-token": xtoken,
    },
    body: JSON.stringify({
      prompt: text,
      temperature: 0.8,
      top_p: 1,
      options: {},
      systemMessage:
        "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
    }),
  });

  const data2 = await response2.text();
  const jsonArray = JSON.parse(`[${data2.split("\\n")}]`);
  const lastJsonObject = jsonArray[jsonArray.length - 1];
  return lastJsonObject.text;
