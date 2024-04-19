import axios from 'axios'
import fetch from 'node-fetch'
import cheerio from 'cheerio'

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    try {
        const res = await nightcafe(text)
        const listSections = Object.entries(res).map(([index, { judul, thumb }], i) => [
            `${i + 1}. ${cmenub} ${judul.trim()}`,
            [
                ['Get Image', usedPrefix + 'get ' + thumb, `\n⌚ By: ${author}\nLink: ${thumb}`]
            ]
        ])
        return conn.sendList(m.chat, htki + ' 📺 nightcafe Search 🔎 ' + htka, `⚡ Silakan pilih nightcafe Search di tombol di bawah...\n*Teks yang anda kirim:* ${text}\n\nKetik ulang *${usedPrefix + command}* teks anda untuk mengubah teks lagi`, author, `☂️ nightcafe Search Disini ☂️`, listSections, m)
    } catch (err) {
        return conn.reply(m.chat, `Error: ${err.message}`, m)
    }
}
handler.help = ['nightcafe']
handler.tags = ['internet']
handler.command = /^nightcafe$/i

const nightcafe = async (query) => {
    const { data } = await axios.get(`https://creator.nightcafe.studio/explore?q=${query}`)
    const $ = cheerio.load(data)
    const thumb = []
    const judul = []
    $('img').each((i, el) => {
        const src = $(el).attr('src')
        if (src.startsWith('https://images.nightcafe.studio/')) {
            thumb.push(src)
        }
    })
    $('img').each((i, el) => {
        judul.push($(el).attr('alt'))
    })
    const result = thumb.reduce((acc, cur, i) => {
        acc[i] = { judul: judul[i], thumb: cur }
        return acc
    }, {})
    return result
}

export default handler
