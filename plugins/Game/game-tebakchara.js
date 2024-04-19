import fetch from 'node-fetch'
import { poll } from 'games'

const timeout = 120000
const poin = 4999

const startGame = (conn, m) => {
    const id = m.chat
    if (id in conn.tebakchara) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakchara[id][0])
        throw false
    }

    return poll(async (m) => {
        const res = await fetch('https://api.jikan.moe/v4/characters')
        const jsons = await res.json()
        const jso = jsons.data
        const json = jso[Math.floor(Math.random() * jso.length)]

        const caption = `*${m.command.toUpperCase()}*\n\nSiapakah nama dari gambar ini?\n\nTimeout *${(timeout / 1000).toFixed(2)} detik*\nKetik ${m.usedPrefix}hcha untuk hint\nBonus: ${poin} XP`

        conn.tebakchara[id] = [
            await conn.sendFile(m.chat, json.images.jpg.image_url, '', caption, m),
            json, poin,
            setTimeout(() => {
                if (conn.tebakchara[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}*\nKanji : ${json.name_kanji}\n*Url :* ${json.url}\n*Desk :* ${json.about}`, conn.tebakchara[id][0])
                    delete conn.tebakchara[id]
                }
            }, timeout)
        ]
    }, {
        conn,
        match: /^tebakchara$/i,
        time: timeout,
        end: (m) => {
            if (conn.tebakchara
