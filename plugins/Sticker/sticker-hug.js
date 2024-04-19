import fetch from 'node-fetch'
import {
    sticker
} from '../../lib/sticker.js'

const API = 'https://api.waifu.pics'

const handler = async (m, {
    conn
}) => {
    try {
        const res = await fetch(`${API}/sfw/hug`)
        const json = await res.json()
        const stiker = await sticker(null, json.url, global.packname, global.author)
        if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, {
            asSticker: true
        })
    } catch (err) {
        console.error(err)
        throw 'Error while fetching the sticker'
    }
}

handler.help = ['stickerhug']
handler.tags = ['sticker']
handler.command = /^hug|stickerhug|stikerhug$/i
handler.limit = true

export default handler
