import {
    googleIt
} from "@bochilteam/scraper"
import GoogleIt from "google-it"

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    args
}) => {
    let text = args.join(" ")
    if (!text) throw "Input teks atau reply teks yang ingin di cari!"
    let google_img = "https://telegra.ph/file/cf62f2b8648a352548978.jpg"
    await m.reply(wait)
    try {
        let search = await GoogleIt({
            query: text
        })
        if (!search.length) {
            search = await googleIt(text)
            if (!search.articles.length) {
                let API_KEY = "7d3eb92cb730ed676d5afbd6c902ac1f"
                let res = await fetch(`http://api.serpstack.com/search?access_key=${API_KEY}&type=web&query=${text}`)
                let json = await res.json()
                search = json.organic_results
            }
        }
        let caption = ""
        search.forEach((v, index) => {
            let title = v.title || 'Tidak terdeteksi'
            let url = v.url || 'Tidak terdeteksi'
            let snippet = v.snippet || 'Tidak terdeteksi'
            caption += `${htki + " " + ++index + " " + htka}\n*${title}*\n  *○ Link:* ${url}\n  *○ Snippet:* ${snippet}\n`
        })
        if (caption) await conn.sendFile(m.chat, google_img, "", caption, m)
        else throw "Query not found"
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["google", "googlef"].map(v => v + " <pencarian>")
handler.tags = ["internet"]
handler.command = /^googlef?$/i
export default handler
