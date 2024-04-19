const Frinkiac = require('../../lib/tools/frinkiac.js').default;

async function frinkHandler(m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) {
    if (!text) throw "Input query and caption required, separated by a pipe (|). Example: " + usedPrefix + command + " memes|says";

    const frinkiac = new Frinkiac();
    const [query, caption] = text.split("|");

    if (!query || !caption) throw "Input query and caption required, separated by a pipe (|). Example: " + usedPrefix + command + " memes|says";

    try {
        const result = await frinkiac.searchMaker(query, caption);
        const frink = Object.entries(result).map(([key, value]) => `  ○ *${key.toUpperCase()}:* ${value}`).join("\n");
        await conn.sendFile(m.chat, result.url, "frink.jpg", frink, m);
    } catch (e) {
        console.error(e);
        await m.reply("Failed to fetch the image. Please try again.");
    }
}

frinkHandler.help = ["frink <query>|<caption>"
].map(v => v + " - " + v.replace(/<.*?>/g, "[$1]"));
frinkHandler.tags = ["maker"];
frinkHandler.command = /^(frink)$/i;
frinkHandler.limit = true;

module.exports = frinkHandler;
