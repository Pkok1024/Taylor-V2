import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Input *URL*\n\nExample: ${usedPrefix + command} https://...`
    let xyz = "&apikey=wudysoft"
    let wtf = await fetch(`https://xzn.wtf/api/oploverzdl?url=` + args[0] + xyz)
    let fak = await wtf.json()

    if (fak.status !== 'Success') throw fak.message

    let str = `
• Status: ${fak.status}
• Studio: ${fak.studio}
• Released: ${fak.released}
• Duration: ${fak.duration}
• Season: ${fak.season}
• Type: ${fak.type}
• Posted_by: ${fak.posted_by}
• Released_on: ${fak.released_on}
• Updated_on: ${fak.updated_on}
• Episode: ${fak.episode}
• Prev: ${fak.prev}
• Next: ${fak.next}
    `.trim()

    let downloads = fak.download
    for (let i = 0; i < downloads.length; i++) {
        let download = downloads[i]
        str += `

•••••••••••••••••••••••••••••••••••••
• Format: ${download.format}

`
        let resolutions = download.resolutions
        for (let j = 0; j < resolutions.length; j++) {
            let resolution = resolutions[j]
            str += `• Resolutions: ${resolution.name}\n`
            let servers = resolution.servers
            for (let k = 0; k < servers.length; k++) {
                let server = servers[k]
                str += `• Server: ${server.name}\n• URL: ${server.link}\n`
            }
        }
    }

    let stiker = await sticker(false, fak.thumbnail, global.packname, global.author)
    conn.sendMessage(m.chat, stiker, { quoted: m })
    conn.reply(m.chat, str, m, { contextInfo: { externalAdReply: { title: fak.anime_id + '\n' + wm, mediaType: 1, previewType: 0, renderLargerThumbnail: true, thumbnailUrl: fak.thumbnail, sourceUrl: args[0] } } })
}

handler.help = ['oploverz <url>']
handler.tags = ['downloader']
handler.command = /^(oploverz)$/i
handler.
