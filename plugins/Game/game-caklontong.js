import {
    caklontong
} from '@bochilteam/scraper'

let timeout = 120000
let poin = 4999

const buttons = [
    ['Hint', '/hcak'],
    ['Nyerah', 'menyerah']
]

const buttonMessage = {
    text: 'Pilih untuk melanjutkan',
    buttons: buttons,
    footer: 'Powered by @bochilteam'
}

const startCaklontong = async (m, conn, usedPrefix) => {
    let imgr = flaaa.getRandom()

    conn.caklontong = conn.caklontong ? conn.caklontong : {}
    let id = m.chat
    if (id in conn.caklontong) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.caklontong[id][0])
        throw false
    }
    const json = await caklontong()
    let caption = `*${command.toUpperCase()}*
${json.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hcak untuk bantuan
Bonus: ${poin} XP
    `.trim()
    conn.caklontong[id] = [
        await conn.sendFile(m.chat, imgr + command, '', caption, m, {
            buttons: buttons,
            headerType: 4
        }),
        json, poin,
        setTimeout(() => {
            if (conn.caklontong[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.caklontong[id][0])
                delete conn.caklontong[id]
            }
        }, timeout)
    ]

