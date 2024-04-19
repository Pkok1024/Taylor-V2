import axios from "axios"
import {
    JSDOM
} from "jsdom"
import path from "path"

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    if (!text) throw "input text"
    try {
        if (command == "mlsounden" || command == "mlsoundid") {
            await m.reply(global.wait)
            let res = await MLSound(command, text)
            let rdm = res[Math.floor(Math.random() * res.length)];
            let {
                data: {
                    headers
                }
            } = await axios.head(rdm)
            let audio = {
                audio: rdm,
                seconds: Math.ceil(parseInt(headers["content-length"]) / 44100),
                ptt: true,
                mimetype: "audio/mpeg",
                fileName: path.basename(rdm),
                waveform: [100, 0, 100, 0, 100, 0, 100]
            }
            await conn.sendMessage(m.chat, audio, {
                quoted: m
            })
        }
    } catch (e) {
        console.error(e)
        await m.reply(global.eror)
    }
}
handler.help = ["mlsounden", "mlsoundid"]
handler.tags = ["internet"]
handler.command = /^mlsound(en|id)$/i

export default handler

/* New Line */
async function MLSound(tema, query) {
    let res
    if (tema == "id") {
        res = await axios.get("https://mobile-legends.fandom.com/wiki/" + query + "/Audio/id")
    }
    if (tema == "en") {
        res = await axios.get("https://mobilelegendsbuild.com/sound/" + query)
    }
    let html = res.data
    let dom = new JSDOM(html)
    let audio = []
    let totals = dom.window.document.getElementsByTagName("audio")
    for (let i = 0; i < totals.length; i++) {
        audio.push(totals[i].getAttribute("src"))
    }
    return audio
}
