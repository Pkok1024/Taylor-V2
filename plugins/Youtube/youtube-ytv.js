import {
    youtubedl,
    youtubedlv2
} from "@bochilteam/scraper"
import fetch from "node-fetch"
import ytdl from "ytdl-core"

let limit = 80
let handler = async (m, {
    conn,
    args,
    isPrems,
    isOwner,
    usedPrefix,
    command
}) => {
    if (!args || !args[0]) throw `✳️ Example :\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`
    if (!args[0].match(/youtu\.?be\.?\/?.?/gi)) throw `❎ Verify that the YouTube link`
    let q = args[1] || "360p"
    if (!["144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p", "4320p"].includes(q)) throw `❎ Invalid quality. Available options: 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, 2160p, 4320p`
    let v = args[0]
    await conn.reply(m.chat, wait, m)

    try {

        let item = await ytmp4(args[0], q)
        if ((item.contentLength).split("MB")[0] >= limit) return m.reply(` ≡  *YT Downloader V1*\n\n*⚖️Size* : ${item.contentLength}\n*🎞️Quality* : ${item.quality}\n\n_The file exceeds the download limit_ *+${limit} MB*\n\n*Link:*\n${await shortUrl(item.videoUrl)}`)
        let captvid = `🔍 *[ RESULT V1 ]*

📷 *Image URL:* ${item.thumb.url || 'Tidak diketahui'}
📚 *Title:* ${item.title || 'Tidak diketahui'}
📅 *Date:* ${item.date || 'Tidak diketahui'}
⏱️ *Duration:* ${item.duration || 'Tidak diketahui'}
📺 *Channel:* ${item.channel || 'Tidak diketahui'}
🔒 *Quality:* ${item.quality || 'Tidak diketahui'}
📦 *Content Length:* ${item.contentLength || 'Tidak diketahui'}
📝 *Description:* ${item.description || 'Tidak diketahui'}
`.trim()
        let dls = "Downloading video succes"
        let doc = {
            video: {
                url: item.videoUrl
            },
            mimetype: "video/mp4",
            caption: captvid,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: v,
                    title: item.title,
                    body: dls,
                    sourceUrl: v,
                    thumbnail: await (await conn.getFile(item.image)).data
                }
            }
        }

        await conn.sendMessage(m.chat, doc, {
            quoted: m
        })

    } catch (e) {
        try {

            const yt = await youtubedl(v).catch(async () => await youtubedlv2(v))
            if (!yt) throw new Error("Failed to get video information")
            const dl_url = await yt.video[q].download()
            if (!dl_url) throw new Error("Failed to get download URL")
            const title = await yt.title
            if (!title) throw new Error("Failed to get video title")
            const size = await yt.video[q].fileSizeH

            if (size.split("MB")[0] >= limit) return m.reply(` ≡  *YT Downloader V2*\n\n*⚖️Size* : ${size}\n*🎞️quality* : ${q}\n\n_The file exceeds the download limit_ *+${limit} MB*\n\n*Link:*\n${await shortUrl(dl_url)}`)
            let captvid = `🔍 *[ RESULT V2 ]*
  
*📌Títle* : ${title || 'Tidak diketahui'}
*📟 Ext* : mp4
*🎞️Quality* : ${q || 'Tidak diketahui'}
*⚖️Size* : ${size || 'Tidak diketahui'}
`.trim()
            let dls = "Downloading video succes"
            let doc = {
                video: {
                    url: dl_url
                },
                mimetype: "video/mp4",
                caption: captvid,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 2,
                        mediaUrl: v,
                        title: title,
                        body: dls,
                        sourceUrl: v,
                        thumbnail: await (await conn.getFile(yt.thumbnail)).data
                    }
                }
            }

            await conn.sendMessage(m.chat, doc, {
               
