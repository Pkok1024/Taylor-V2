import { randomUUID } from "crypto";
import fetch from "node-fetch";

const fakeYouToken = "187b56b2217ac09dbe6ae610f19b35dfbc53cdd5857f818f03b45d048287b4bc";

const fetchPatiently = async (url, params) => {
  let response = await fetch(url, params);
  while (response.status === 408 || response.status === 502) {
    await new Promise((res) => setTimeout(res, 3000));
    response = await fetch(url, params);
  }
  return response;
};

const poll = async (token) => {
  const response = await fetchPatiently(`https://api.fakeyou.com/tts/job/${token}`, {
    method: "GET",
    headers: {
      Authorization: fakeYouToken,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed polling");
  }

  const json = await response.json();

  if (json.state.status === "complete_success") {
    return `https://storage.googleapis.com/vocodes-public${json.state.maybe_public_bucket_wav_audio_path}`;
  }

  if (json.state.status === "pending" || json.state.status === "started" || json.state.status === "attempt_failed") {
    return await poll(token);
  }

  throw new Error("Failed polling");
};

const requestSpeech = async (voice, message) => {
  const response = await fetchPatiently("https://api.fakeyou.com/tts/inference", {
    method: "POST",
    body: JSON.stringify({
      tts_model_token: voice,
      uuid_idempotency_token: randomUUID(),
      inference_text: message,
    }),
    headers: {
      Authorization: fakeYouToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed voice request");
  }

  const json = await response.json();

  if (json.success) {
    return await poll(json.inference_job_token);
  }

  throw new Error("Failed voice request");
};

const handler = async (m, { conn, isOwner, usedPrefix, command, args }) => {
  const ListVoice = await (await fetch("https://api.fakeyou.com/tts/list")).json();
  const lister = ListVoice.models;
  const readMore = String.fromCharCode(8206).repeat(4001);

  const query = `Input query!\n\n*Example:*\n${usedPrefix + command} [angka]|[teks]\n\n*Pilih angka yg ada*\n` + readMore + lister.map((item, index) => "  " + (index + 1) + ". " + item.title).join("\n");
  let text;
  if (args.length >= 1) {
    text = args.slice(0).join(" ");
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    throw query;
  }

  const [atas, bawah] = text.split("|");
  if (!atas || !bawah) {
    throw query;
  }

  const { modelToken, title } = await getModelByIndex(ListVoice, atas);

  await m.reply(wait + "\n" + title);

  try {
    const res = await requestSpeech(modelToken, bawah);
    if (res) await conn.sendFile(m.chat, res, '', '', m, null, {
      ptt: true,
      waveform: [100, 0, 100, 0, 100, 0, 100],
      contextInfo: adReplyS.contextInfo
    });
  } catch (e) {
    await m.reply(eror);
  }
};

handler.help = ["ttsc *number|your text*"];
handler.tags = ["misc"];
handler.command = /^(ttsc)$/i;

export default handler;

const getModelByIndex = (arrayObject, index) => {
  const response = arrayObject;
  const model = response.models[index - 1];
  if (model) {
    const { model_token, title } = model;
    return {
      modelToken: model_token,
      title
    };
  } else {
    throw new Error('Invalid index');
  }
};
