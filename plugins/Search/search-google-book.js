import fetch from "node-fetch";
import { v4 as uuidv4 } from 'uuid';

let handler = async (m, {
    conn,
    usedPrefix,
    text,
    args,
    command
}) => {
    let spas = "                ";
    let lister = [
        "all",
        "sort",
        "file"
    ];
    let [feature, querys] = text.split(/[^\w\s]/g);
    if (!lister.includes(feature)) return m.reply("*Example:*\n.gbook api\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));
    if (!querys) return m.reply("Input Query!");
    await m.reply(wait);

    try {
        let data = await getBookInfo(feature, querys);
        if (feature == "sort" || feature == "all") {
            let capt = await formatData([data]);
            await conn.reply(m.chat, `*${htki} 📺 Books Search 🔎 ${htka}*\n${capt}`, m);
        } else if (feature == "file") {
            if (!querys.startsWith("https://")) return m.reply("Invalid file URL!");
            let response = await fetch(querys);
            if (!response.ok) return m.reply("Error fetching file!");
            let fileType = response.headers.get('content-type');
            if (!fileType.startsWith("application/epub+zip")) return m.reply("Invalid file type! Only EPUB files are allowed.");
            let fileId = uuidv4();
            await conn.sendMessage(m.chat, {
                document: {
                    url: querys,
                    mimetype: fileType,
                    fileName: `book_${fileId}.epub`,
                    fileSize: response.headers.get('content-length')
                },
                caption: `*${htki} 📺 Books Search 🔎 ${htka}*`,
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            }, {
                quoted: m,
                sendEphemeral: true
            });
        }
    } catch (err) {
        m.reply("Error fetching data from Google Books API!");
    }
}

handler.help = ["gbook"];
handler.tags = ["search"];
handler.command = /^(gbook)$/i;
export default handler;

function formatData(data) {
    let output = '';
    data.forEach((item, index) => {
        output += `*[ Result ${index + 1} ]*\n`;
        Object.keys(item).forEach(key => {
            output += ` *${key}:* `;
            if (typeof item[key] === 'object') {
                Object.keys(item[key]).forEach(subKey => {
                    output += `\n *${subKey}:* ${item[key][subKey]}`
                })
            } else {
                output += ` ${item[key]}\n`;
            }
        });
    });
    return output;
}

async function getBookInfo(type, query) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&download=epub&key=AIzaSyD4bymyi_wD_OIO9kEP26jir5rR3ft
