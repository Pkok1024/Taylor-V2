import fetch from "node-fetch";

const characterCategories = {
  naruto: {
    // ... (same as before)
  },
  genshin: {
    // ... (same as before)
  },
  fortnite: {
    // ... (same as before)
  },
  indonesiaPresidents: {
    // ... (same as before)
  },
  humanTraits: {
    // ... (same as before)
  },
  schoolSubjects: {
    // ... (same as before)
  },
};

const categoryNames = Object.keys(characterCategories);

const handler = async (m, { conn, args, usedPrefix, command }) => {
  conn.aiproxy = conn.aiproxy || {};

  const getCategory = (index) => categoryNames[index - 1];
  const getCharacter = (category, index) => Object.keys(characterCategories[category])[index];

  if (command === 'aiproxyset') {
    const categoryIndex = parseInt(args[0]) - 1;
    const characterIndex = parseInt(args[1]) - 1;

    const selectedCategory = getCategory(categoryIndex);

    if (!selectedCategory) {
      return m.reply(`Invalid category number. Choose a number between 1 and ${categoryNames.length}.\nAvailable categories:\n${categoryNames.join('\n')}`);
    }

    const selectedCharacter = getCharacter(selectedCategory, characterIndex);

    if (selectedCharacter) {
      conn.aiproxy = {
        name: selectedCharacter,
        profile: characterCategories[selectedCategory][selectedCharacter],
      };
      return m.reply(`Character set to: *${conn.aiproxy.name}*`);
    } else {
      return m.reply(`Invalid character number. Choose a number between 1 and ${Object.keys(characterCategories[selectedCategory]).length}.\nExample usage:\n*${usedPrefix}${command} 1 2*\nAvailable characters:\n${Object.keys(characterCategories[selectedCategory]).join('\n')}`);
    }
  }

  if (!conn.aiproxy.name && !conn.aiproxy.profile) {
    return m.reply(`Set a character before using.\nUse *${usedPrefix}aiproxyset* to set a character.\nAvailable categories:\n${categoryNames.join('\n')}`);
  }

  if (command === 'aiproxy') {
    const text = args.length >= 1 ? args.join(" ") : m.quoted && m.quoted.text || "";
    if (!text) return m.reply(`Enter text or reply to a message with text to process.\nExample usage:\n*${usedPrefix}${command} Hi, how are you?*`);

    await m.reply(wait);

    try {
      const output = await chatAI(text, conn.aiproxy.profile);

      if (output) {
        await m.reply(`*${conn.aiproxy.name}*\n\n${output}`);
      } else {
        await m.reply("No output generated.");
      }
    } catch (error) {
      console.error('Error during chatAI:', error);
      await m.reply('An error occurred during processing.');
    }
  }
};

handler.help = ["aiproxy", "aiproxyset"];
handler.tags = ["ai"];
handler.command = /^(aiproxy|aiproxyset)$/i;
handler.limit = true

export default handler;

async function chatAI(query, profile, model) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer sk-bpGbwgFrNi9GKcNd9DBAd6QwGtuecv30SU2gAreQzVO8XUrF"
  };

  const raw = JSON.stringify({
    model: model || "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: profile
    }, {
      role: "user",
      content: query
    }]
  });

  const options = {
    method: 'POST',
    headers,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch("https://api.aiproxy.io/v1/chat/completions", options);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
  }
}
