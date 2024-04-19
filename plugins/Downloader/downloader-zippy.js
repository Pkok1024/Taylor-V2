import fetch from 'node-fetch'
import {
    szippydl
} from '../../lib/scraper/scrape.js'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    if (!args[0]) throw `Use example ${usedPrefix}${command} https://www.tiktok.com/@omagadsus/video/7025456384175017243`

    try {
        let res = await szippydl(args[0])
        let {
            title,
            extension,
            filesize,
            upload,
            link
        } = res

        if (!extension.includes('mp4')) throw new Error('Invalid file type. Only mp4 files are supported.')
        if (filesize > MAX_FILE_SIZE) throw new Error(`File size is too big. Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`)

        let done = `*title:* ${title}
*extension:* ${extension}
*filesize:* ${filesize}
*upload:* ${upload}
*link:* ${link}`

        if (link) return conn.sendFile(m.chat, link, '', done, m)
    } catch (err) {
        throw err.message
    }
}
handler.help = ['zippy(share)?(ser)?(sher)?(sare)?'].map(v => v + ' <url>')
handler.tags = ['downloader']

handler.command = /^(zippy(share)?(ser)?(sher)?(sare)?)$/i

export default handler

